import {
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
  PRODUCT_CARD_FRAGMENT,
} from '@/lib/fragments';

export const COLLECTIONS_QUERY = `#graphql
  query Collections(
    $first: Int = 24, 
    $productsFirst: Int = 12
    $query: String = ""
  ) {
    collections(first: $first, query: $query) {
      nodes {
        id
        title
        handle
        description
        image {
          ...ImageFragment
        }
        products(first: $productsFirst) {
          nodes {
            ...ProductCardFragment
          }
        }
      }
    }
  }

  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PRODUCT_CARD_FRAGMENT}
`;
