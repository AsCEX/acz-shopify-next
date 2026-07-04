import { shopifyFetch } from "@/lib/shopify";
import { PRODUCT_QUERY } from "@/lib/queries/product";
import type { Image as ShopifyImage, Money, ProductQuery } from "@/lib/types";
import Image from "next/image";
import { notFound } from "next/navigation";
import { addToCart } from "./actions";

function formatMoney(money: Money) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: money.currencyCode,
  }).format(Number(money.amount));
}

function uniqueImages(images: ShopifyImage[]) {
  const seen = new Set<string>();

  return images.filter((image) => {
    if (seen.has(image.url)) {
      return false;
    }

    seen.add(image.url);
    return true;
  });
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ cart?: string }>;
}) {
  const { handle } = await params;
  const { cart: cartStatus } = await searchParams;

  const data = await shopifyFetch<ProductQuery>({
    query: PRODUCT_QUERY,
    variables: {
      handle,
    },
  });

  const product = data.product;

  if (!product) {
    notFound();
  }

  const images = uniqueImages(
    [product.featuredImage, ...product.images.nodes].filter(
      Boolean,
    ) as ShopifyImage[],
  );
  const primaryImage = images[0];
  const selectedVariant =
    product.variants.nodes.find((variant) => variant.availableForSale) ??
    product.variants.nodes[0];
  const compareAtPrice = selectedVariant?.compareAtPrice;
  const price = selectedVariant?.price ?? product.priceRange.minVariantPrice;
  const hasMultiplePrices =
    product.priceRange.minVariantPrice.amount !==
    product.priceRange.maxVariantPrice.amount;
  const isOnSale =
    compareAtPrice && Number(compareAtPrice.amount) > Number(price.amount);
  const availableVariants = product.variants.nodes.filter(
    (variant) => variant.availableForSale,
  ).length;
  const canAddToCart = availableVariants > 0 && Boolean(selectedVariant?.id);
  const returnTo = `/products/${product.handle}`;

  return (
    <div className="h-full min-h-0 overflow-y-auto overscroll-contain bg-white pb-28">
      <article className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-4 md:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] md:gap-8 md:px-6 md:py-8 lg:px-8">
        <section className="min-w-0">
          {primaryImage ? (
            <div className="overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={primaryImage.url}
                alt={primaryImage.altText || product.title}
                width={primaryImage.width || 1200}
                height={primaryImage.height || 1200}
                priority
                className="aspect-square w-full object-cover"
              />
            </div>
          ) : (
            <div className="grid aspect-square place-items-center rounded-lg bg-gray-100 text-sm text-gray-500">
              No image available
            </div>
          )}

          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5">
              {images.slice(1, 6).map((image) => (
                <div
                  key={image.url}
                  className="overflow-hidden rounded-md bg-gray-100"
                >
                  <Image
                    src={image.url}
                    alt={image.altText || product.title}
                    width={image.width || 400}
                    height={image.height || 400}
                    className="aspect-square w-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="min-w-0 md:sticky md:top-4 md:self-start">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-normal text-gray-500">
            {product.vendor && <span>{product.vendor}</span>}
            {product.productType && (
              <>
                <span className="h-1 w-1 rounded-full bg-gray-300" />
                <span>{product.productType}</span>
              </>
            )}
          </div>

          <h1 className="mt-2 text-2xl font-bold leading-tight text-gray-950 md:text-3xl">
            {product.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-end gap-2">
            {isOnSale && (
              <span className="rounded bg-red-600 px-2 py-1 text-xs font-bold uppercase tracking-normal text-white">
                Sale
              </span>
            )}
            <span className="text-2xl font-bold text-[var(--color-primary)]">
              {hasMultiplePrices ? "From " : ""}
              {formatMoney(price)}
            </span>
            {isOnSale && compareAtPrice && (
              <span className="pb-1 text-sm font-semibold text-gray-400 line-through">
                {formatMoney(compareAtPrice)}
              </span>
            )}
          </div>

          <div className="mt-5 rounded-md border border-black/10 bg-gray-50 p-3 text-sm text-gray-700">
            <div className="flex items-center justify-between gap-4">
              <span>Availability</span>
              <span className="font-semibold text-gray-950">
                {availableVariants > 0 ? "In stock" : "Out of stock"}
              </span>
            </div>
            {selectedVariant?.sku && (
              <div className="mt-2 flex items-center justify-between gap-4">
                <span>SKU</span>
                <span className="font-mono text-xs text-gray-700">
                  {selectedVariant.sku}
                </span>
              </div>
            )}
          </div>

          {cartStatus === "added" && (
            <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">
              Added to cart.
            </p>
          )}

          {cartStatus === "error" && (
            <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              Could not add this item. Please try again.
            </p>
          )}

          {product.options.length > 0 && (
            <div className="mt-6 space-y-5">
              {product.options.map((option) => (
                <div key={option.id}>
                  <h2 className="text-sm font-bold text-gray-950">
                    {option.name}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {option.optionValues.map((value) => (
                      <span
                        key={value.id}
                        className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-gray-800"
                      >
                        {value.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <form action={addToCart}>
            <input
              type="hidden"
              name="merchandiseId"
              value={selectedVariant?.id || ""}
            />
            <input type="hidden" name="returnTo" value={returnTo} />

            <div className="mt-6 grid grid-cols-[6rem_1fr] gap-3">
              <label
                htmlFor="quantity"
                className="self-center text-sm font-bold text-gray-950"
              >
                Quantity
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                defaultValue="1"
                className="h-11 w-24 rounded-md border border-black/10 px-3 text-sm font-semibold outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="submit"
                disabled={!canAddToCart}
                className="h-12 rounded-md bg-[var(--color-primary)] px-5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Add to cart
              </button>
            <button
              type="button"
              disabled={!canAddToCart}
              className="h-12 rounded-md border border-[var(--color-primary)] px-5 text-sm font-bold text-[var(--color-primary)] transition hover:bg-teal-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
            >
              Buy now
            </button>
            </div>
          </form>

          <div className="mt-6 border-t border-black/10 pt-5">
            <h2 className="text-sm font-bold text-gray-950">Details</h2>
            {product.descriptionHtml ? (
              <div
                className="mt-3 space-y-3 text-sm leading-6 text-gray-700 [&_li]:ml-5 [&_li]:list-disc [&_p]:m-0 [&_ul]:space-y-1"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            ) : (
              <p className="mt-3 text-sm leading-6 text-gray-700">
                {product.description}
              </p>
            )}
          </div>
        </section>
      </article>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-black/10 bg-white/95 px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-gray-950">
              {product.title}
            </p>
            <p className="text-sm font-bold text-[var(--color-primary)]">
              {hasMultiplePrices ? "From " : ""}
              {formatMoney(price)}
            </p>
          </div>
          <form action={addToCart} className="shrink-0">
            <input
              type="hidden"
              name="merchandiseId"
              value={selectedVariant?.id || ""}
            />
            <input type="hidden" name="quantity" value="1" />
            <input type="hidden" name="returnTo" value={returnTo} />
            <button
              type="submit"
              disabled={!canAddToCart}
              className="h-11 rounded-md bg-[var(--color-primary)] px-5 text-sm font-bold text-white disabled:bg-gray-300"
            >
              Add to cart
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
