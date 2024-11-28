export type AppReviewResponse = {
  success: number;
  query_summary: ReviewSummary;
  reviews: Review[];
  cursor: string;
};

export type ReviewSummary = {
  num_reviews: number;
  review_score: number;
  review_score_desc: string;
  total_positive: number;
  total_negative: number;
  total_reviews: number;
};

export type Review = {
  recommendationid: string;
  author: Author;
  language: string;
  review: string;
  timestamp_created: number;
  timestamp_updated: number;
  voted_up: boolean;
  votes_up: number;
  votes_funny: number;
  weighted_vote_score: number;
  comment_count: number;
  steam_purchase: boolean;
  received_for_free: boolean;
  written_during_early_access: boolean;
  primarily_steam_deck: boolean;
};

export type Author = {
  steamid: string;
  num_games_owned: number;
  num_reviews: number;
  playtime_forever: number;
  playtime_last_two_weeks: number;
  playtime_at_review: number;
  deck_playtime_at_review: number;
  last_played: number;
};
