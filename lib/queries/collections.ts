import { IMAGE_FRAGMENT } from '@/lib/fragments';

export const COLLECTIONS_QUERY = `#graphql
  query Collections($first: Int = 24) {
    collections(first: $first) {
      nodes {
        id
        title
        handle
        description
        image {
          ...ImageFragment
        }
      }
    }
  }

  ${IMAGE_FRAGMENT}
`;
