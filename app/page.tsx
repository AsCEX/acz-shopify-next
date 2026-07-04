import {shopifyFetch} from '@/lib/shopify';
import {COLLECTIONS_QUERY} from '@/lib/queries/collections';
import type {CollectionsQuery} from '@/lib/types';
import SwipeTabs from '@/components/SwipeTabs';

const EXCLUDED_COLLECTION_HANDLES = new Set(["frontpage", "hidden"]);

export default async function HomePage() {
  const collectionsData = await shopifyFetch<CollectionsQuery>({
    query: COLLECTIONS_QUERY,
    variables: {
      query: "collection_type:custom",
    }
  });

  const collections = collectionsData.collections.nodes.filter(
    (collection) => !EXCLUDED_COLLECTION_HANDLES.has(collection.handle),
  );

  return (
    <>
      <SwipeTabs collections={collections} />

    </>
  );
}
