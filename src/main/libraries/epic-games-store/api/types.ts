type CatalogElement = {
  id: string;
  offerType: string;
};

export type Catalog = {
  Catalog: {
    catalogOffers: {
      elements: CatalogElement[];
    };
  };
};
