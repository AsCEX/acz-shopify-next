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
        collectionSlider: metafield(namespace: "custom", key: "collection_slider") {
          references(first: 20) {
            nodes {
              ... on Metaobject {
                id
                backgroundColor: field(key: "background_color") {
                  value
                }
                textColor: field(key: "text_color") {
                  value
                }
                activeTextColor: field(key: "active_text_color") {
                  value
                }
                imageField: field(key: "image") {
                  reference {
                    ... on MediaImage {
                      image {
                        ...ImageFragment
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PRODUCT_CARD_FRAGMENT}
`;
