import {
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
  PRODUCT_CARD_FRAGMENT,
} from '@/lib/fragments';

export const PRODUCTS_QUERY = `#graphql
  query Products(
    $first: Int = 12
    $query: String
    $reverse: Boolean = false
    $sortKey: ProductSortKeys = CREATED_AT
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    products(first: $first, query: $query, reverse: $reverse, sortKey: $sortKey) {
      nodes {
        ...ProductCardFragment
      }
    }
  }

  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PRODUCT_CARD_FRAGMENT}
`;
