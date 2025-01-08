type CatalogElement = {
  id: string;
};

export type Catalog = {
  Catalog: {
    catalogOffers: {
      elements: CatalogElement[];
    };
  };
};
