import { removeCartLine, updateCartLine } from "@/app/cart/actions";
import { CART_QUERY } from "@/lib/queries/cart";
import { shopifyFetch } from "@/lib/shopify";
import type { Cart, CartLine, CartQuery, Money } from "@/lib/types";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

const CART_ID_COOKIE = "acz_cart_id";

function formatMoney(money: Money) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
  }).format(Number(money.amount));
}

async function getCart() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_ID_COOKIE)?.value;

  if (!cartId) {
    return null;
  }

  try {
    const data = await shopifyFetch<CartQuery>({
      query: CART_QUERY,
      variables: {
        cartId,
      },
    });

    return data.cart;
  } catch {
    return null;
  }
}

function CartStatus({ status }: { status?: string }) {
  if (status === "updated") {
    return (
      <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
        Cart updated.
      </p>
    );
  }

  if (status === "removed") {
    return (
      <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
        Item removed.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
        Something went wrong. Please try again.
      </p>
    );
  }

  return null;
}

function EmptyCart() {
  return (
    <div className="grid h-full min-h-0 place-items-center overflow-y-auto bg-white px-4 py-10">
      <section className="mx-auto max-w-sm text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gray-100 text-2xl font-bold text-[var(--color-primary)]">
          0
        </div>
        <h1 className="mt-5 text-2xl font-bold text-gray-950">
          Your cart is empty
        </h1>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          Add a few products and they will show up here for checkout.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-[var(--color-primary)] px-5 text-sm font-bold text-white"
        >
          Continue shopping
        </Link>
      </section>
    </div>
  );
}

function CartLineItem({ line }: { line: CartLine }) {
  const product = line.merchandise.product;
  const image = line.merchandise.image ?? product.featuredImage;
  const selectedOptions = line.merchandise.selectedOptions.filter(
    (option) => option.value !== "Default Title",
  );

  return (
    <li className="grid grid-cols-[5.5rem_1fr] gap-3 border-b border-black/10 py-4 last:border-b-0 sm:grid-cols-[7rem_1fr]">
      <Link
        href={`/products/${product.handle}`}
        className="overflow-hidden rounded-md bg-gray-100"
      >
        {image ? (
          <Image
            src={image.url}
            alt={image.altText || product.title}
            width={image.width || 400}
            height={image.height || 400}
            className="aspect-square w-full object-cover"
          />
        ) : (
          <span className="grid aspect-square place-items-center text-xs text-gray-500">
            No image
          </span>
        )}
      </Link>

      <div className="min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/products/${product.handle}`}
              className="block truncate text-sm font-bold text-gray-950"
            >
              {product.title}
            </Link>
            <p className="mt-1 text-sm font-semibold text-[var(--color-primary)]">
              {formatMoney(line.merchandise.price)}
            </p>
          </div>
          <p className="shrink-0 text-sm font-bold text-gray-950">
            {formatMoney(line.cost.totalAmount)}
          </p>
        </div>

        {selectedOptions.length > 0 && (
          <dl className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
            {selectedOptions.map((option) => (
              <div key={`${line.id}-${option.name}`}>
                <dt className="inline font-semibold">{option.name}: </dt>
                <dd className="inline">{option.value}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <form action={updateCartLine} className="flex items-center gap-2">
            <input type="hidden" name="lineId" value={line.id} />
            <label htmlFor={`quantity-${line.id}`} className="sr-only">
              Quantity
            </label>
            <input
              id={`quantity-${line.id}`}
              name="quantity"
              type="number"
              min="0"
              defaultValue={line.quantity}
              className="h-9 w-20 rounded-md border border-black/10 px-2 text-sm font-semibold outline-none focus:border-[var(--color-primary)]"
            />
            <button
              type="submit"
              className="h-9 rounded-md border border-black/10 px-3 text-xs font-bold text-gray-800"
            >
              Update
            </button>
          </form>

          <form action={removeCartLine}>
            <input type="hidden" name="lineId" value={line.id} />
            <button
              type="submit"
              className="h-9 rounded-md px-3 text-xs font-bold text-red-600"
            >
              Remove
            </button>
          </form>
        </div>
      </div>
    </li>
  );
}

function CartSummary({ cart }: { cart: Cart }) {
  return (
    <aside className="rounded-md border border-black/10 bg-gray-50 p-4 md:sticky md:top-4 md:self-start">
      <h2 className="text-base font-bold text-gray-950">Order summary</h2>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-gray-600">Items</span>
          <span className="font-semibold text-gray-950">{cart.totalQuantity}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-semibold text-gray-950">
            {formatMoney(cart.cost.subtotalAmount)}
          </span>
        </div>
        {cart.cost.totalTaxAmount && (
          <div className="flex justify-between gap-4">
            <span className="text-gray-600">Tax</span>
            <span className="font-semibold text-gray-950">
              {formatMoney(cart.cost.totalTaxAmount)}
            </span>
          </div>
        )}
        {cart.cost.totalDutyAmount && (
          <div className="flex justify-between gap-4">
            <span className="text-gray-600">Duties</span>
            <span className="font-semibold text-gray-950">
              {formatMoney(cart.cost.totalDutyAmount)}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 border-t border-black/10 pt-4">
        <div className="flex justify-between gap-4 text-base font-bold text-gray-950">
          <span>Total</span>
          <span>{formatMoney(cart.cost.totalAmount)}</span>
        </div>
        <p className="mt-2 text-xs leading-5 text-gray-500">
          Shipping and discounts are calculated during checkout.
        </p>
      </div>

      <a
        href={cart.checkoutUrl}
        className="mt-5 flex h-12 w-full items-center justify-center rounded-md bg-[var(--color-primary)] px-5 text-sm font-bold text-white"
      >
        Checkout
      </a>
      <Link
        href="/"
        className="mt-3 flex h-11 w-full items-center justify-center rounded-md border border-[var(--color-primary)] px-5 text-sm font-bold text-[var(--color-primary)]"
      >
        Continue shopping
      </Link>
    </aside>
  );
}

export default async function CartPage({
  searchParams,
}: {
  searchParams: Promise<{ cart?: string }>;
}) {
  const [{ cart: cartStatus }, cart] = await Promise.all([
    searchParams,
    getCart(),
  ]);

  if (!cart || cart.lines.nodes.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="h-full min-h-0 overflow-y-auto overscroll-contain bg-white pb-28">
      <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-4 md:grid-cols-[minmax(0,1fr)_22rem] md:px-6 md:py-8 lg:px-8">
        <section className="min-w-0">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-950">Cart</h1>
              <p className="mt-1 text-sm text-gray-600">
                {cart.totalQuantity} {cart.totalQuantity === 1 ? "item" : "items"}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <CartStatus status={cartStatus} />
          </div>

          <ul className="mt-2 rounded-md border border-black/10 bg-white px-3">
            {cart.lines.nodes.map((line) => (
              <CartLineItem key={line.id} line={line} />
            ))}
          </ul>
        </section>

        <CartSummary cart={cart} />
      </main>
    </div>
  );
}
