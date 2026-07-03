import {shopifyFetch} from '@/lib/shopify';
import {PRODUCTS_QUERY} from '@/lib/queries/products';
import type {ProductCard, ProductsQuery} from '@/lib/types';
import Image from 'next/image';

export default async function HomePage() {
  const data = await shopifyFetch<ProductsQuery>({
    query: PRODUCTS_QUERY,
  });

  const products = data.products.nodes;

  return (
    <section className="grid grid-cols-2 gap-6 md:grid-cols-4">
      {products.map((product: ProductCard) => (
        <a key={product.id} href={`/products/${product.handle}`}>
          {product.featuredImage ? (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText || product.title}
              width={product.featuredImage.width || 600}
              height={product.featuredImage.height || 600}
              className="w-full aspect-square object-cover"
            />
          ) : null}
          <h2>{product.title}</h2>
          <p>
            {product.priceRange.minVariantPrice.amount}{' '}
            {product.priceRange.minVariantPrice.currencyCode}
          </p>
        </a>
      ))}
    </section>
  );
}
