import {
  CUSTOMER_AUTH_COOKIE_NAMES,
  discoverCustomerAuth,
  getCookieOptions,
  getCustomerAccountClientId,
  getCustomerAccountRedirectUri,
  getCustomerAccountScope,
} from "@/lib/customer-account";
import { createHash, randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

function randomBase64Url(bytes = 32) {
  return randomBytes(bytes).toString("base64url");
}

function createCodeChallenge(verifier: string) {
  return createHash("sha256").update(verifier).digest("base64url");
}

function redirectToProfile(request: NextRequest, status: string) {
  return NextResponse.redirect(new URL(`/profile?auth=${status}`, request.url));
}

export async function GET(request: NextRequest) {
  const clientId = getCustomerAccountClientId();

  if (!clientId) {
    return redirectToProfile(request, "missing_config");
  }

  try {
    const discovery = await discoverCustomerAuth();
    const origin = request.nextUrl.origin;
    const redirectUri = getCustomerAccountRedirectUri(origin);
    const state = randomBase64Url();
    const nonce = randomBase64Url();
    const verifier = randomBase64Url(64);
    const challenge = createCodeChallenge(verifier);
    const authorizationUrl = new URL(discovery.authorization_endpoint);

    authorizationUrl.searchParams.set("client_id", clientId);
    authorizationUrl.searchParams.set("code_challenge", challenge);
    authorizationUrl.searchParams.set("code_challenge_method", "S256");
    authorizationUrl.searchParams.set("nonce", nonce);
    authorizationUrl.searchParams.set("redirect_uri", redirectUri);
    authorizationUrl.searchParams.set("response_type", "code");
    authorizationUrl.searchParams.set("scope", getCustomerAccountScope());
    authorizationUrl.searchParams.set("state", state);

    const response = NextResponse.redirect(authorizationUrl);
    const cookieOptions = getCookieOptions(60 * 10);

    response.cookies.set(CUSTOMER_AUTH_COOKIE_NAMES.state, state, cookieOptions);
    response.cookies.set(CUSTOMER_AUTH_COOKIE_NAMES.nonce, nonce, cookieOptions);
    response.cookies.set(
      CUSTOMER_AUTH_COOKIE_NAMES.verifier,
      verifier,
      cookieOptions,
    );

    return response;
  } catch {
    return redirectToProfile(request, "error");
  }
}
