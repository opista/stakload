/// <reference types="vite/client" />

interface GameEntity {
  _id: string;
  [key: string]: any;
  ageRatings: any[];
  createdAt: string | Date;
  library: string;
  name: string;
}

interface CollectionEntity {
  _id: string;
  [key: string]: any;
  filters: any;
  name: string;
}
