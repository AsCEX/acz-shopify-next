"use server";

import { CART_LINES_REMOVE_MUTATION } from "@/lib/mutations/cartLinesRemove";
import { CART_LINES_UPDATE_MUTATION } from "@/lib/mutations/cartLinesUpdate";
import { shopifyFetch } from "@/lib/shopify";
import type { CartLinesRemoveMutation, CartLinesUpdateMutation } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const CART_ID_COOKIE = "acz_cart_id";

function getCartStatusPath(status: "updated" | "removed" | "error") {
  return `/cart?cart=${status}`;
}

function parseQuantity(value: FormDataEntryValue | null) {
  const quantity = Number(value);

  if (!Number.isFinite(quantity)) {
    return 1;
  }

  return Math.max(0, Math.floor(quantity));
}

function getMutationError(
  userErrors: Array<{ message: string }>,
  warnings: Array<{ message: string }>,
) {
  return userErrors[0]?.message || warnings[0]?.message;
}

async function getCartId() {
  const cookieStore = await cookies();

  return cookieStore.get(CART_ID_COOKIE)?.value;
}

async function updateLine(cartId: string, lineId: string, quantity: number) {
  const data = await shopifyFetch<CartLinesUpdateMutation>({
    query: CART_LINES_UPDATE_MUTATION,
    variables: {
      cartId,
      lines: [
        {
          id: lineId,
          quantity,
        },
      ],
    },
  });

  const error = getMutationError(
    data.cartLinesUpdate.userErrors,
    data.cartLinesUpdate.warnings,
  );

  if (error || !data.cartLinesUpdate.cart) {
    throw new Error(error || "Unable to update cart.");
  }
}

async function removeLine(cartId: string, lineId: string) {
  const data = await shopifyFetch<CartLinesRemoveMutation>({
    query: CART_LINES_REMOVE_MUTATION,
    variables: {
      cartId,
      lineIds: [lineId],
    },
  });

  const error = getMutationError(
    data.cartLinesRemove.userErrors,
    data.cartLinesRemove.warnings,
  );

  if (error || !data.cartLinesRemove.cart) {
    throw new Error(error || "Unable to remove cart line.");
  }
}

export async function updateCartLine(formData: FormData) {
  const cartId = await getCartId();
  const lineId = formData.get("lineId");
  const quantity = parseQuantity(formData.get("quantity"));

  if (!cartId || typeof lineId !== "string" || !lineId) {
    redirect(getCartStatusPath("error"));
  }

  try {
    if (quantity === 0) {
      await removeLine(cartId, lineId);
    } else {
      await updateLine(cartId, lineId, quantity);
    }
  } catch {
    redirect(getCartStatusPath("error"));
  }

  revalidatePath("/cart");
  redirect(getCartStatusPath("updated"));
}

export async function removeCartLine(formData: FormData) {
  const cartId = await getCartId();
  const lineId = formData.get("lineId");

  if (!cartId || typeof lineId !== "string" || !lineId) {
    redirect(getCartStatusPath("error"));
  }

  try {
    await removeLine(cartId, lineId);
  } catch {
    redirect(getCartStatusPath("error"));
  }

  revalidatePath("/cart");
  redirect(getCartStatusPath("removed"));
}
