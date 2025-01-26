import { LikeLibrary } from "@contracts/database/games";

const BASE_URL = import.meta.env.MAIN_VITE_TRULAUNCH_API_URL;

export const fetchGameMetadata = async (gameId: string, library: LikeLibrary) => {
  try {
    const response = await fetch(`${BASE_URL}/games/${gameId}?library=${library}`);

    if (response.status === 200) {
      /**
       * TODO - revisit this. The API contract
       * should be shared. Move trulaunch-api into
       * this repo and convert to monorepo
       */
      const parsed = await response.json();

      return parsed;
    }

    return null;
  } catch (err) {
    // TODO - handle error
    return null;
  }
};
