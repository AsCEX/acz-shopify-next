"use server";

import { CART_CREATE_MUTATION } from "@/lib/mutations/cartCreate";
import { CART_LINES_ADD_MUTATION } from "@/lib/mutations/cartLinesAdd";
import { shopifyFetch } from "@/lib/shopify";
import type { CartCreateMutation, CartLinesAddMutation } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const CART_ID_COOKIE = "acz_cart_id";

function getSafeReturnTo(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

function appendCartStatus(path: string, status: "added" | "error") {
  const separator = path.includes("?") ? "&" : "?";

  return `${path}${separator}cart=${status}`;
}

function parseQuantity(value: FormDataEntryValue | null) {
  const quantity = Number(value);

  if (!Number.isFinite(quantity) || quantity < 1) {
    return 1;
  }

  return Math.floor(quantity);
}

function getMutationError(
  userErrors: Array<{ message: string }>,
  warnings: Array<{ message: string }>,
) {
  return userErrors[0]?.message || warnings[0]?.message;
}

async function setCartCookie(cartId: string) {
  const cookieStore = await cookies();

  cookieStore.set(CART_ID_COOKIE, cartId, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

async function createCart(merchandiseId: string, quantity: number) {
  const data = await shopifyFetch<CartCreateMutation>({
    query: CART_CREATE_MUTATION,
    variables: {
      input: {
        lines: [
          {
            merchandiseId,
            quantity,
          },
        ],
      },
    },
  });

  const error = getMutationError(
    data.cartCreate.userErrors,
    data.cartCreate.warnings,
  );

  if (error || !data.cartCreate.cart) {
    throw new Error(error || "Unable to create cart.");
  }

  return data.cartCreate.cart;
}

async function addLineToCart(
  cartId: string,
  merchandiseId: string,
  quantity: number,
) {
  const data = await shopifyFetch<CartLinesAddMutation>({
    query: CART_LINES_ADD_MUTATION,
    variables: {
      cartId,
      lines: [
        {
          merchandiseId,
          quantity,
        },
      ],
    },
  });

  const error = getMutationError(
    data.cartLinesAdd.userErrors,
    data.cartLinesAdd.warnings,
  );

  if (error || !data.cartLinesAdd.cart) {
    throw new Error(error || "Unable to add item to cart.");
  }

  return data.cartLinesAdd.cart;
}

export async function addToCart(formData: FormData) {
  const merchandiseId = formData.get("merchandiseId");
  const returnTo = getSafeReturnTo(formData.get("returnTo"));
  const quantity = parseQuantity(formData.get("quantity"));

  if (typeof merchandiseId !== "string" || !merchandiseId) {
    redirect(appendCartStatus(returnTo, "error"));
  }

  const cookieStore = await cookies();
  const existingCartId = cookieStore.get(CART_ID_COOKIE)?.value;

  try {
    const cart = existingCartId
      ? await addLineToCart(existingCartId, merchandiseId, quantity)
      : await createCart(merchandiseId, quantity);

    await setCartCookie(cart.id);
  } catch {
    const cart = await createCart(merchandiseId, quantity);

    await setCartCookie(cart.id);
  }

  revalidatePath("/cart");
  redirect(appendCartStatus(returnTo, "added"));
}
