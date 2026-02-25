import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ConsoleLogger, Injectable } from "@nestjs/common";

import CatalogQuery from "./catalog-query.graphql";
import { Catalog } from "./types";

const client = new ApolloClient({
  link: new HttpLink({
    headers: {
      Origin: "https://epicgames.com",
    },
    uri: "https://graphql.epicgames.com/graphql",
  }),
  cache: new InMemoryCache(),
});

@Injectable()
export class EpicGamesStoreApiService {
  constructor(private readonly logger: ConsoleLogger) {
    this.logger.setContext(this.constructor.name);
  }

  async getGameId(namespace: string): Promise<string | null> {
    this.logger.debug("Querying EpicGamesStore API for game ID", { namespace });
    try {
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
      if (game) {
        this.logger.log("Found game ID from EpicGamesStore API", {
          gameId: game.id,
          namespace,
        });
      } else {
        this.logger.warn("No game found matching BASE_GAME offer type", { namespace });
      }
      return game?.id ?? null;
    } catch (error: unknown) {
      this.logger.error("Error fetching game ID from EpicGamesStore API", { error, namespace });
      throw error;
    }
  }
}
