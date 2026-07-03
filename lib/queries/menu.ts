export const MENU_QUERY = `#graphql
  query Menu($handle: String!) {
    menu(handle: $handle) {
      id
      handle
      items {
        id
        title
        url
        type
        items {
          id
          title
          url
          type
          items {
            id
            title
            url
            type
          }
        }
      }
    }
  }
`;
