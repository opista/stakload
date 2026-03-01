export type OwnedGamesResponse = {
  response: {
    game_count: number;
    games: OwnedGameDetails[];
  };
};

export type OwnedGameDetails = {
  appid: number;
  content_descriptorids: number[];
  has_community_visible_stats: boolean;
  img_icon_url: string;
  name: string;
  playtime_deck_forever: number;
  playtime_disconnected: number;
  playtime_forever: number;
  playtime_linux_forever: number;
  playtime_mac_forever: number;
  playtime_windows_forever: number;
  rtime_last_played: number;
};
