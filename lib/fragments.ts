export const IMAGE_FRAGMENT = `#graphql
  fragment ImageFragment on Image {
    url
    altText
    width
    height
  }
`;

export const MONEY_FRAGMENT = `#graphql
  fragment MoneyFragment on MoneyV2 {
    amount
    currencyCode
  }
`;

export const SEO_FRAGMENT = `#graphql
  fragment SeoFragment on SEO {
    title
    description
  }
`;

export const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment ProductCardFragment on Product {
    id
    title
    handle
    vendor
    featuredImage {
      ...ImageFragment
    }
    priceRange {
      minVariantPrice {
        ...MoneyFragment
      }
      maxVariantPrice {
        ...MoneyFragment
      }
    }
  }
`;

export const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariantFragment on ProductVariant {
    id
    title
    availableForSale
    sku
    price {
      ...MoneyFragment
    }
    compareAtPrice {
      ...MoneyFragment
    }
    selectedOptions {
      name
      value
    }
    image {
      ...ImageFragment
    }
  }
`;

export const PRODUCT_FRAGMENT = `#graphql
  fragment ProductFragment on Product {
    id
    title
    handle
    description
    descriptionHtml
    vendor
    productType
    featuredImage {
      ...ImageFragment
    }
    images(first: 10) {
      nodes {
        ...ImageFragment
      }
    }
    options {
      id
      name
      optionValues {
        id
        name
      }
    }
    priceRange {
      minVariantPrice {
        ...MoneyFragment
      }
      maxVariantPrice {
        ...MoneyFragment
      }
    }
    variants(first: 100) {
      nodes {
        ...ProductVariantFragment
      }
    }
    seo {
      ...SeoFragment
    }
  }
`;

export const CART_FRAGMENT = `#graphql
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    buyerIdentity {
      countryCode
      email
      phone
    }
    cost {
      subtotalAmount {
        ...MoneyFragment
      }
      totalAmount {
        ...MoneyFragment
      }
      totalDutyAmount {
        ...MoneyFragment
      }
      totalTaxAmount {
        ...MoneyFragment
      }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost {
          totalAmount {
            ...MoneyFragment
          }
        }
        merchandise {
          ... on ProductVariant {
            ...ProductVariantFragment
            product {
              id
              title
              handle
              featuredImage {
                ...ImageFragment
              }
            }
          }
        }
      }
    }
  }
`;
