import {
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
  PRODUCT_CARD_FRAGMENT,
} from '@/lib/fragments';

export const SEARCH_QUERY = `#graphql
  query Search(
    $query: String!
    $first: Int = 24
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    search(query: $query, first: $first, types: [PRODUCT]) {
      nodes {
        ... on Product {
          ...ProductCardFragment
        }
      }
    }
  }

  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PRODUCT_CARD_FRAGMENT}
`;
