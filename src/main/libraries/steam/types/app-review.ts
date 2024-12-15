export type AppReviewResponse = {
  cursor: string;
  query_summary: ReviewSummary;
  reviews: Review[];
  success: number;
};

export type ReviewSummary = {
  num_reviews: number;
  review_score: number;
  review_score_desc: string;
  total_negative: number;
  total_positive: number;
  total_reviews: number;
};

export type Review = {
  author: Author;
  comment_count: number;
  language: string;
  primarily_steam_deck: boolean;
  received_for_free: boolean;
  recommendationid: string;
  review: string;
  steam_purchase: boolean;
  timestamp_created: number;
  timestamp_updated: number;
  voted_up: boolean;
  votes_funny: number;
  votes_up: number;
  weighted_vote_score: number;
  written_during_early_access: boolean;
};

export type Author = {
  deck_playtime_at_review: number;
  last_played: number;
  num_games_owned: number;
  num_reviews: number;
  playtime_at_review: number;
  playtime_forever: number;
  playtime_last_two_weeks: number;
  steamid: string;
};
