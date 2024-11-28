export type AppDetailsResponse = {
  [key: string]: {
    success: boolean;
    data: AppDetails;
  };
};

export type AppDetails = {
  type: AppType;
  name: string;
  steam_appid: number;
  required_age: number;
  is_free: boolean;
  controller_support?: string;
  detailed_description: string;
  about_the_game: string;
  short_description: string;
  supported_languages: string;
  header_image: string;
  capsule_image: string;
  capsule_imagev5: string;
  website: string;
  pc_requirements: DeviceRequirements | [];
  mac_requirements: DeviceRequirements | [];
  linux_requirements: DeviceRequirements | [];
  developers: string[];
  publishers: string[];
  price_overview: PriceOverview;
  packages: number[];
  package_groups: PackageGroup[];
  platforms: Platforms;
  categories: Category[];
  genres: Genre[];
  screenshots: Screenshot[];
  movies: Movie[];
  achievements: Achievements;
  release_date: ReleaseDate;
  support_info: SupportInfo;
  background: string;
  background_raw: string;
  content_descriptors: ContentDescriptors;
  ratings: null;
};

export enum AppType {
  App = "app",
  Game = "game",
}

export type Achievements = {
  total: number;
  highlighted: HighlightedAchievement[];
};

export type HighlightedAchievement = {
  name: string;
  path: string;
};

export type Category = {
  id: number;
  description: string;
};

export type ContentDescriptors = {
  ids: number[];
  notes: string | null;
};

export type Genre = {
  id: string;
  description: string;
};

export type Movie = {
  id: number;
  name: string;
  thumbnail: string;
  webm: Mp4;
  mp4: Mp4;
  highlight: boolean;
};

export type Mp4 = {
  "480": string;
  max: string;
};

export type PackageGroup = {
  name: string;
  title: string;
  description: string;
  selection_text: string;
  save_text: string;
  display_type: number;
  is_recurring_subscription: string;
  subs: Sub[];
};

export type Sub = {
  packageid: number;
  percent_savings_text: string;
  percent_savings: number;
  option_text: string;
  option_description: string;
  can_get_free_license: string;
  is_free_license: boolean;
  price_in_cents_with_discount: number;
};

export type DeviceRequirements = {
  minimum: string;
  recommended?: string;
};

export type Platforms = {
  windows: boolean;
  mac: boolean;
  linux: boolean;
};

export type PriceOverview = {
  currency: string;
  initial: number;
  final: number;
  discount_percent: number;
  initial_formatted: string;
  final_formatted: string;
};

export type ReleaseDate = {
  coming_soon: boolean;
  date: string;
};

export type Screenshot = {
  id: number;
  path_thumbnail: string;
  path_full: string;
};

export type SupportInfo = {
  url: string;
  email: string;
};
