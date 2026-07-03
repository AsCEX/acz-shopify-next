import {
  CART_FRAGMENT,
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
  PRODUCT_VARIANT_FRAGMENT,
} from '@/lib/fragments';

export const CART_CREATE_MUTATION = `#graphql
  mutation CartCreate($input: CartInput) {
    cartCreate(input: $input) {
      cart {
        ...CartFragment
      }
      userErrors {
        field
        message
        code
      }
      warnings {
        code
        message
      }
    }
  }

  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
  ${CART_FRAGMENT}
`;
