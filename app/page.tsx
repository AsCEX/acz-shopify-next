import {shopifyFetch} from '@/lib/shopify';
import {PRODUCTS_QUERY} from '@/lib/queries/products';
import type {ProductCard, ProductsQuery} from '@/lib/types';
import Image from 'next/image';
import SwipeTabs from '@/components/SwipeTabs';

export default async function HomePage() {
  const data = await shopifyFetch<ProductsQuery>({
    query: PRODUCTS_QUERY,
  });

  const products = data.products.nodes;

  return (
    <>
      <SwipeTabs products={products} />

    </>
  );
}
