const EPIC_GAMES_ACCOUNT_URL = "https://account-public-service-prod03.ol.epicgames.com/account/api/public/account";
const EPIC_GAMES_ASSETS_URL =
  "https://launcher-public-service-prod06.ol.epicgames.com/launcher/api/public/assets/Windows?label=Live";
const EPIC_GAMES_CATALOG_URL = "https://catalog-public-service-prod06.ol.epicgames.com/catalog/api/shared/namespace";
const EPIC_GAMES_OAUTH_URL = "https://account-public-service-prod03.ol.epicgames.com/account/api/oauth/token";
const EPIC_GAMES_LIBRARY_URL = "https://library-service.live.use1a.on.epicgames.com";
const AUTH_TOKEN = "MzRhMDJjZjhmNDQxNGUyOWIxNTkyMTg3NmRhMzZmOWE6ZGFhZmJjY2M3Mzc3NDUwMzlkZmZlNTNkOTRmYzc2Y2Y=";

type Token = {
  access_token: string;
  account_id: string;
  acr: string;
  app: string;
  auth_time: string;
  client_it: string;
  client_service: string;
  device_id: string;
  displayName: string;
  expires_at: string;
  expires_in: number;
  in_app_id: string;
  refresh_expires: number;
  refresh_expires_at: string;
  refresh_token: string;
  scope: string[];
  token_type: string;
};

type Asset = {
  appName: string;
  assetId: string;
  buildVersion: string;
  catalogItemId: string;
  labelName: string;
  metadata: {
    installationPoolId: string;
  };
  namespace: string;
};

type CatalogItem = {
  [key: string]: {
    applicationId: string;
    categories: { path: string }[];
    creationDate: string;
    description: string;
    developer: string;
    developerId: string;
    endOfSupport: boolean;
    entitlementName: string;
    entitlementType: string;
    id: string;
    itemTupe: string;
    keyImages: {
      alt: string;
      height: number;
      md5: string;
      size: number;
      type: string;
      uploadedDate: string;
      url: string;
      width: number;
    }[];
    lastModifiedDate: string;
    namespace: string;
    requiresSecureAccount: boolean;
    status: string;
    title: string;
    unsearchable: boolean;
  };
};

export const getAuthToken = async (authorizationCode: string) => {
  try {
    const response = await fetch(EPIC_GAMES_OAUTH_URL, {
      body: `grant_type=authorization_code&code=${authorizationCode}&token_type=eg1`,
      headers: {
        Authorization: `basic ${AUTH_TOKEN}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const parsed = await response.json();

    return parsed as Token;
  } catch (err) {
    const message = "Request to Epic Games API failed";
    console.error(message, { err });
    throw new Error(message);
  }
};

export const refreshToken = async (refreshToken: string) => {
  try {
    const response = await fetch(EPIC_GAMES_OAUTH_URL, {
      body: `grant_type=refresh_token&refresh_token=${refreshToken}&token_type=eg1`,
      headers: {
        Authorization: `basic ${AUTH_TOKEN}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    });

    const parsed = await response.json();

    return parsed as Token;
  } catch (err) {
    const message = "Request to Epic Games API failed";
    console.error(message, { err });
    throw new Error(message);
  }
};

export const getAssets = async (token: Token) => {
  // TODO, check logged in state, refresh token if need-be

  try {
    const response = await fetch(EPIC_GAMES_ASSETS_URL, {
      headers: {
        Authorization: `${token.token_type} ${token.access_token}`,
      },
      method: "GET",
    });

    const parsed = await response.json();

    return parsed as Asset[];
  } catch (err) {
    const message = "Request to Epic Games API failed";
    console.error(message, { err });
    throw new Error(message);
  }
};

export const getCatalogItem = async (namespace: string, catalogItemId: string, token: Token) => {
  const path = `/${namespace}/bulk/items?id=${catalogItemId}&country=US&locale=en-US&includeMainGameDetails=true&includeDLCDetails=true`;

  try {
    const response = await fetch(`${EPIC_GAMES_CATALOG_URL}${path}`, {
      headers: {
        Authorization: `${token.token_type} ${token.access_token}`,
      },
      method: "GET",
    });

    const parsed = await response.json();

    return parsed as CatalogItem;
  } catch (err) {
    const message = "Request to Epic Games API failed";
    console.error(message, { err });
    throw new Error(message);
  }
};

export const getLibraryItems = async (token: Token) => {
  const path = `/library/api/public/items?includeMetadata=true`;

  try {
    const response = await fetch(`${EPIC_GAMES_LIBRARY_URL}${path}`, {
      headers: {
        Authorization: `${token.token_type} ${token.access_token}`,
      },
      method: "GET",
    });

    const parsed = await response.json();

    return parsed as CatalogItem;
  } catch (err) {
    const message = "Request to Epic Games API failed";
    console.error(message, { err });
    throw new Error(message);
  }
};
