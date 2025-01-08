import { ApolloClient, InMemoryCache } from "@apollo/client/core/core.cjs";

import CatalogQuery from "./catalog-query.graphql";
import { Catalog } from "./types/catalog";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  headers: {
    Origin: "https://epicgames.com",
  },
  uri: "https://graphql.epicgames.com/graphql",
});

export const graphqlGetGameId = async (namespace: string): Promise<string | null> => {
  const result = await client.query<Catalog>({
    fetchPolicy: "no-cache",
    query: CatalogQuery,
    variables: {
      country: "US",
      language: "en",
      namespace,
    },
  });

  if (result.data.Catalog.catalogOffers.elements.length === 0) {
    console.error("No game found for namespace", namespace);
    return null;
  }

  if (result.data.Catalog.catalogOffers.elements.length > 1) {
    console.error("Multiple games found for namespace", namespace);
    return null;
  }

  return result.data.Catalog.catalogOffers.elements[0].id;
};
