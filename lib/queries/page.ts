import { SEO_FRAGMENT } from '@/lib/fragments';

export const PAGE_QUERY = `#graphql
  query Page($handle: String!) {
    page(handle: $handle) {
      id
      title
      handle
      body
      bodySummary
      seo {
        ...SeoFragment
      }
    }
  }

  ${SEO_FRAGMENT}
`;
