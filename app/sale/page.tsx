import { PRODUCTS_QUERY } from "@/lib/queries/products";
import { shopifyFetch } from "@/lib/shopify";
import type { Money, ProductCard, ProductsQuery } from "@/lib/types";
import Image from 'next/image';


function formatMoney(money: Money) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: money.currencyCode,
  }).format(Number(money.amount));
}

export default async function SalePage() {

  const [productsData] = await Promise.all([
    shopifyFetch<ProductsQuery>({
      query: PRODUCTS_QUERY,
      variables: {
        handle: 'sale',
      },
    })
  ]);


  const products = productsData.products.nodes;

  return (
    <>
        <div className="h-full min-h-0 overflow-y-auto overscroll-contain p-2">
          <section className="columns-2 gap-4 md:columns-4 pb-26">
              {products.map((product: ProductCard) => {
                const price = product.priceRange.minVariantPrice;
                const compareAtPrice = product.compareAtPriceRange.minVariantPrice;
                const showComparePrice =
                  Number(compareAtPrice.amount) > Number(price.amount);

                return (
              <a key={product.id} href={`/products/${product.handle}`} className="relative mb-4 block break-inside-avoid overflow-hidden rounded-md bg-gray-100 shadow transition-shadow hover:shadow-md">
                  <span className="absolute left-2 top-2 z-10 rounded bg-red-600 px-2 py-1 text-xs font-bold uppercase tracking-normal text-white shadow-sm">
                    Sale
                  </span>
                  {product.featuredImage ? (
                  <Image
                      src={product.featuredImage.url}
                      alt={product.featuredImage.altText || product.title}
                      width={product.featuredImage.width || 600}
                      height={product.featuredImage.height || 600}
                      className="w-full aspect-square object-cover rounded"
                  />
                  ) : null}
                  <div className="p-2">
                      <h2 className={'truncate text-sm'}>{product.title}</h2>
                      {showComparePrice && (
                          <span className="flex w-full text-sm text-red-500 font-semibold line-through">
                              {formatMoney(compareAtPrice)}
                          </span>
                      )}
                      <span className="text-sm text-[var(--color-primary)] font-semibold" >
                        {formatMoney(price)}
                      </span>
                  </div>
              </a>
                );
              })}
          </section>
        </div>
    </>
  );
}
