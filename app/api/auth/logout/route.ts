import {
  CUSTOMER_AUTH_COOKIE_NAMES,
  discoverCustomerAuth,
} from "@/lib/customer-account";
import { NextRequest, NextResponse } from "next/server";

function clearAuthCookies(response: NextResponse) {
  Object.values(CUSTOMER_AUTH_COOKIE_NAMES).forEach((name) => {
    response.cookies.delete(name);
  });
}

export async function GET(request: NextRequest) {
  const postLogoutUrl = new URL("/profile?auth=signed_out", request.url);
  const idToken = request.cookies.get(CUSTOMER_AUTH_COOKIE_NAMES.idToken)?.value;

  try {
    const discovery = await discoverCustomerAuth();

    if (discovery.end_session_endpoint) {
      const logoutUrl = new URL(discovery.end_session_endpoint);

      logoutUrl.searchParams.set("post_logout_redirect_uri", postLogoutUrl.href);

      if (idToken) {
        logoutUrl.searchParams.set("id_token_hint", idToken);
      }

      const response = NextResponse.redirect(logoutUrl);

      clearAuthCookies(response);
      return response;
    }
  } catch {
    // Local cookie cleanup still signs the customer out of this storefront.
  }

  const response = NextResponse.redirect(postLogoutUrl);

  clearAuthCookies(response);
  return response;
}
