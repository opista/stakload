import { ApolloClient, InMemoryCache } from "@apollo/client/core/core.cjs";
import { Service } from "typedi";

import CatalogQuery from "./catalog-query.graphql";
import { Catalog } from "./types";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  headers: {
    Origin: "https://epicgames.com",
  },
  uri: "https://graphql.epicgames.com/graphql",
});

@Service()
export class EpicGamesStoreApiService {
  async getGameId(namespace: string): Promise<string | null> {
    const result = await client.query<Catalog>({
      fetchPolicy: "no-cache",
      query: CatalogQuery,
      variables: {
        count: 1000,
        country: "US",
        language: "en",
        namespace,
      },
    });

    const game = result.data.Catalog.catalogOffers.elements.find(({ offerType }) => offerType === "BASE_GAME");

    return game?.id ?? null;
  }
}
