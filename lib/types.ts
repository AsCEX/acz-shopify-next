export type Money = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  url: string;
  altText: string | null;
  width?: number | null;
  height?: number | null;
};

export type Seo = {
  title: string | null;
  description: string | null;
};

export type ProductOptionValue = {
  id: string;
  name: string;
};

export type ProductOption = {
  id: string;
  name: string;
  optionValues: ProductOptionValue[];
};

export type SelectedOption = {
  name: string;
  value: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  sku: string | null;
  price: Money;
  compareAtPrice: Money | null;
  selectedOptions: SelectedOption[];
  image: Image | null;
};

export type ProductCard = {
  id: string;
  title: string;
  handle: string;
  vendor: string;
  featuredImage: Image | null;
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  compareAtPriceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
};

export type Product = ProductCard & {
  description: string;
  descriptionHtml: string;
  productType: string;
  images: {
    nodes: Image[];
  };
  options: ProductOption[];
  variants: {
    nodes: ProductVariant[];
  };
  seo: Seo;
};

export type Collection = {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  image: Image | null;
  seo: Seo;
  products: {
    nodes: ProductCard[];
  };
};

export type MenuItem = {
  id: string;
  title: string;
  url: string | null;
  type: string;
  items: MenuItem[];
};

export type Menu = {
  id: string;
  handle: string;
  items: MenuItem[];
};

export type CartLine = {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: ProductVariant & {
    product: Pick<ProductCard, 'id' | 'title' | 'handle' | 'featuredImage'>;
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  buyerIdentity: {
    countryCode: string | null;
    email: string | null;
    phone: string | null;
  };
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalDutyAmount: Money | null;
    totalTaxAmount: Money | null;
  };
  lines: {
    nodes: CartLine[];
  };
};

export type CartUserError = {
  field: string[] | null;
  message: string;
  code?: string;
};

export type CartWarning = {
  code: string;
  message: string;
  target?: string;
};

export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo: Seo;
};

export type ProductsQuery = {
  products: {
    nodes: ProductCard[];
  };
};

export type ProductQuery = {
  product: Product | null;
};

export type CollectionQuery = {
  collection: Collection | null;
};

export type CollectionsQuery = {
  collections: {
    nodes: Array<
      Pick<
        Collection,
        'id' | 'title' | 'handle' | 'description' | 'image' | 'products'
      > & {
        collectionSlider: {
          references: {
            nodes: Array<{
              id: string;
              backgroundColor: {
                value: string | null;
              } | null;
              textColor: {
                value: string | null;
              } | null;
              activeTextColor: {
                value: string | null;
              } | null;
              imageField: {
                reference: {
                  image: Image | null;
                } | null;
              } | null;
            }>;
          };
        } | null;
      }
    >;
  };
};

export type CartQuery = {
  cart: Cart | null;
};

export type CartCreateMutation = {
  cartCreate: {
    cart: Cart | null;
    userErrors: CartUserError[];
    warnings: CartWarning[];
  };
};

export type CartLinesAddMutation = {
  cartLinesAdd: {
    cart: Cart | null;
    userErrors: CartUserError[];
    warnings: CartWarning[];
  };
};

export type CartLinesUpdateMutation = {
  cartLinesUpdate: {
    cart: Cart | null;
    userErrors: CartUserError[];
    warnings: CartWarning[];
  };
};

export type CartLinesRemoveMutation = {
  cartLinesRemove: {
    cart: Cart | null;
    userErrors: CartUserError[];
    warnings: CartWarning[];
  };
};

export type MenuQuery = {
  menu: Menu | null;
};

export type SearchQuery = {
  search: {
    nodes: ProductCard[];
  };
};

export type PageQuery = {
  page: Page | null;
};
