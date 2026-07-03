import {
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
  PRODUCT_CARD_FRAGMENT,
  SEO_FRAGMENT,
} from '@/lib/fragments';

export const COLLECTION_QUERY = `#graphql
  query Collection(
    $handle: String!
    $first: Int = 24
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      image {
        ...ImageFragment
      }
      seo {
        ...SeoFragment
      }
      products(first: $first) {
        nodes {
          ...ProductCardFragment
        }
      }
    }
  }

  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${SEO_FRAGMENT}
  ${PRODUCT_CARD_FRAGMENT}
`;
