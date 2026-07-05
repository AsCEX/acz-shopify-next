import {
  CUSTOMER_AUTH_COOKIE_NAMES,
  exchangeCustomerCodeForToken,
  getCookieOptions,
  getCustomerAccountRedirectUri,
} from "@/lib/customer-account";
import { NextRequest, NextResponse } from "next/server";

function profileRedirect(request: NextRequest, status: string) {
  return NextResponse.redirect(new URL(`/profile?auth=${status}`, request.url));
}

function clearTransientCookies(response: NextResponse) {
  response.cookies.delete(CUSTOMER_AUTH_COOKIE_NAMES.state);
  response.cookies.delete(CUSTOMER_AUTH_COOKIE_NAMES.nonce);
  response.cookies.delete(CUSTOMER_AUTH_COOKIE_NAMES.verifier);
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const returnedState = request.nextUrl.searchParams.get("state");
  const authError = request.nextUrl.searchParams.get("error");
  const storedState = request.cookies.get(CUSTOMER_AUTH_COOKIE_NAMES.state)?.value;
  const verifier = request.cookies.get(
    CUSTOMER_AUTH_COOKIE_NAMES.verifier,
  )?.value;

  if (authError) {
    const response = profileRedirect(request, "cancelled");

    clearTransientCookies(response);
    return response;
  }

  if (!code || !verifier || !storedState || storedState !== returnedState) {
    const response = profileRedirect(request, "invalid_state");

    clearTransientCookies(response);
    return response;
  }

  try {
    const token = await exchangeCustomerCodeForToken({
      code,
      codeVerifier: verifier,
      redirectUri: getCustomerAccountRedirectUri(request.nextUrl.origin),
    });
    const response = profileRedirect(request, "signed_in");
    const accessTokenMaxAge = Math.max(token.expires_in - 60, 60);
    const expiresAt = String(Date.now() + accessTokenMaxAge * 1000);

    response.cookies.set(
      CUSTOMER_AUTH_COOKIE_NAMES.accessToken,
      token.access_token,
      getCookieOptions(accessTokenMaxAge),
    );
    response.cookies.set(
      CUSTOMER_AUTH_COOKIE_NAMES.expiresAt,
      expiresAt,
      getCookieOptions(accessTokenMaxAge),
    );

    if (token.refresh_token) {
      response.cookies.set(
        CUSTOMER_AUTH_COOKIE_NAMES.refreshToken,
        token.refresh_token,
        getCookieOptions(60 * 60 * 24 * 30),
      );
    }

    if (token.id_token) {
      response.cookies.set(
        CUSTOMER_AUTH_COOKIE_NAMES.idToken,
        token.id_token,
        getCookieOptions(60 * 60 * 24),
      );
    }

    clearTransientCookies(response);
    return response;
  } catch {
    const response = profileRedirect(request, "error");

    clearTransientCookies(response);
    return response;
  }
}
