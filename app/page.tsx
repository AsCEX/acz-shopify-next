import {shopifyFetch} from '@/lib/shopify';
import {COLLECTIONS_QUERY} from '@/lib/queries/collections';
import {PRODUCTS_QUERY} from '@/lib/queries/products';  
import type {CollectionsQuery, ProductsQuery} from '@/lib/types';
import SwipeTabs from '@/components/SwipeTabs';

const EXCLUDED_COLLECTION_HANDLES = new Set(["frontpage", "hidden"]);

export default async function HomePage() {



  const [productsData, collectionsData] = await Promise.all([
    shopifyFetch<ProductsQuery>({
      query: PRODUCTS_QUERY,
    }),
    shopifyFetch<CollectionsQuery>({
      query: COLLECTIONS_QUERY,
      variables: {
        query: "collection_type:custom",
      }
    })
  ]);


  return (
    <>
      <SwipeTabs collections={collectionsData.collections.nodes} allProducts={productsData.products.nodes} />
    </>
  );
}
