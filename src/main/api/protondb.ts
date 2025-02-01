export const getProtondbTier = async (gameId: string) => {
  try {
    const response = await fetch(`https://www.protondb.com/api/v1/reports/summaries/${gameId}.json`);
    const parsed = await response.json();
    return parsed.tier;
  } catch (err) {
    // TODO - Logging
    return null;
  }
};
