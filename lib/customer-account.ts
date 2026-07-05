import { cookies } from "next/headers";

export const CUSTOMER_AUTH_COOKIE_NAMES = {
  accessToken: "acz_customer_access_token",
  expiresAt: "acz_customer_access_token_expires_at",
  idToken: "acz_customer_id_token",
  nonce: "acz_customer_auth_nonce",
  refreshToken: "acz_customer_refresh_token",
  state: "acz_customer_auth_state",
  verifier: "acz_customer_auth_verifier",
} as const;

export type CustomerAccountTokenResponse = {
  access_token: string;
  expires_in: number;
  id_token?: string;
  refresh_token?: string;
  token_type: string;
};

export type CustomerAccountDiscovery = {
  authorization_endpoint: string;
  end_session_endpoint?: string;
  token_endpoint: string;
};

type CustomerAccountApiDiscovery = {
  customer_account_api_url?: string;
  graphql_api?: string;
  graphql_api_endpoint?: string;
  api_endpoint?: string;
  endpoints?: {
    graphql?: string;
    customer_account_api?: string;
  };
};

export type CustomerProfile = {
  id: string;
  displayName: string;
  firstName: string | null;
  lastName: string | null;
  emailAddress: {
    emailAddress: string;
  } | null;
  orders: {
    nodes: Array<{
      id: string;
      name: string;
      processedAt: string;
      statusPageUrl: string;
      totalPrice: {
        amount: string;
        currencyCode: string;
      };
    }>;
  };
};

type CustomerProfileQuery = {
  customer: CustomerProfile;
};

export function getCustomerAccountDomain() {
  return (
    process.env.SHOPIFY_CUSTOMER_ACCOUNT_DOMAIN ||
    process.env.SHOPIFY_STORE_DOMAIN ||
    ""
  );
}

export function getCustomerAccountClientId() {
  return process.env.SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID || "";
}

export function getCustomerAccountApiVersion() {
  return process.env.SHOPIFY_CUSTOMER_ACCOUNT_API_VERSION || "2026-07";
}

export function getCustomerAccountRedirectUri(origin: string) {
  return (
    process.env.SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI ||
    `${origin}/api/auth/callback`
  );
}

export function getCustomerAccountScope() {
  return (
    process.env.SHOPIFY_CUSTOMER_ACCOUNT_SCOPE ||
    "openid email customer-account-api:full"
  );
}

export function getCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export async function discoverCustomerAuth() {
  const domain = getCustomerAccountDomain();

  if (!domain) {
    throw new Error("Missing SHOPIFY_CUSTOMER_ACCOUNT_DOMAIN.");
  }

  const response = await fetch(
    `https://${domain}/.well-known/openid-configuration`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Unable to discover Customer Account auth endpoints.");
  }

  return (await response.json()) as CustomerAccountDiscovery;
}

async function discoverCustomerApiEndpoint() {
  const domain = getCustomerAccountDomain();

  if (!domain) {
    return null;
  }

  const response = await fetch(
    `https://${domain}/.well-known/customer-account-api`,
    {
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return null;
  }

  const config = (await response.json()) as CustomerAccountApiDiscovery;

  return (
    config.graphql_api_endpoint ||
    config.graphql_api ||
    config.customer_account_api_url ||
    config.api_endpoint ||
    config.endpoints?.graphql ||
    config.endpoints?.customer_account_api ||
    null
  );
}

export async function getCustomerAccessToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CUSTOMER_AUTH_COOKIE_NAMES.accessToken)?.value;
  const expiresAt = Number(
    cookieStore.get(CUSTOMER_AUTH_COOKIE_NAMES.expiresAt)?.value,
  );

  if (!token || !Number.isFinite(expiresAt) || Date.now() >= expiresAt) {
    return null;
  }

  return token;
}

export async function exchangeCustomerCodeForToken({
  code,
  codeVerifier,
  redirectUri,
}: {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}) {
  const clientId = getCustomerAccountClientId();
  const discovery = await discoverCustomerAuth();
  const body = new URLSearchParams({
    client_id: clientId,
    code,
    code_verifier: codeVerifier,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  });

  const response = await fetch(discovery.token_endpoint, {
    body,
    cache: "no-store",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Unable to exchange customer authorization code.");
  }

  return (await response.json()) as CustomerAccountTokenResponse;
}

export async function fetchCustomerProfile() {
  const accessToken = await getCustomerAccessToken();

  if (!accessToken) {
    return null;
  }

  const endpoint = await discoverCustomerApiEndpoint();

  if (!endpoint) {
    return null;
  }

  const response = await fetch(endpoint, {
    body: JSON.stringify({
      query: `#graphql
        query CustomerProfile {
          customer {
            id
            displayName
            firstName
            lastName
            emailAddress {
              emailAddress
            }
            orders(first: 5, reverse: true) {
              nodes {
                id
                name
                processedAt
                statusPageUrl
                totalPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      `,
    }),
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    return null;
  }

  const json = (await response.json()) as {
    data?: CustomerProfileQuery;
    errors?: unknown[];
  };

  if (json.errors || !json.data?.customer) {
    return null;
  }

  return json.data.customer;
}
