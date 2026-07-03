import { shopifyFetch } from "@/lib/shopify";
import { PRODUCT_QUERY } from "@/lib/queries/product";
import type { ProductQuery } from "@/lib/types";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  const data = await shopifyFetch<ProductQuery>({
    query: PRODUCT_QUERY,
    variables: {
      handle,
    },
  });

  const product = data.product;

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
    </div>
  );
}
