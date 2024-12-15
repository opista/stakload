export type AppDetailsResponse = {
  [key: string]: {
    data: AppDetails;
    success: boolean;
  };
};

export type AppDetails = {
  about_the_game: string;
  achievements: Achievements;
  background: string;
  background_raw: string;
  capsule_image: string;
  capsule_imagev5: string;
  categories: Category[];
  content_descriptors: ContentDescriptors;
  controller_support?: string;
  detailed_description: string;
  developers: string[];
  genres: Genre[];
  header_image: string;
  is_free: boolean;
  linux_requirements: DeviceRequirements | [];
  mac_requirements: DeviceRequirements | [];
  movies: Movie[];
  name: string;
  package_groups: PackageGroup[];
  packages: number[];
  pc_requirements: DeviceRequirements | [];
  platforms: Platforms;
  price_overview: PriceOverview;
  publishers: string[];
  ratings: null;
  release_date: ReleaseDate;
  required_age: number;
  screenshots: Screenshot[];
  short_description: string;
  steam_appid: number;
  support_info: SupportInfo;
  supported_languages: string;
  type: AppType;
  website: string;
};

export enum AppType {
  App = "app",
  Game = "game",
}

export type Achievements = {
  highlighted: HighlightedAchievement[];
  total: number;
};

export type HighlightedAchievement = {
  name: string;
  path: string;
};

export type Category = {
  description: string;
  id: number;
};

export type ContentDescriptors = {
  ids: number[];
  notes: string | null;
};

export type Genre = {
  description: string;
  id: string;
};

export type Movie = {
  highlight: boolean;
  id: number;
  mp4: Mp4;
  name: string;
  thumbnail: string;
  webm: Mp4;
};

export type Mp4 = {
  "480": string;
  max: string;
};

export type PackageGroup = {
  description: string;
  display_type: number;
  is_recurring_subscription: string;
  name: string;
  save_text: string;
  selection_text: string;
  subs: Sub[];
  title: string;
};

export type Sub = {
  can_get_free_license: string;
  is_free_license: boolean;
  option_description: string;
  option_text: string;
  packageid: number;
  percent_savings: number;
  percent_savings_text: string;
  price_in_cents_with_discount: number;
};

export type DeviceRequirements = {
  minimum: string;
  recommended?: string;
};

export type Platforms = {
  linux: boolean;
  mac: boolean;
  windows: boolean;
};

export type PriceOverview = {
  currency: string;
  discount_percent: number;
  final: number;
  final_formatted: string;
  initial: number;
  initial_formatted: string;
};

export type ReleaseDate = {
  coming_soon: boolean;
  date: string;
};

export type Screenshot = {
  id: number;
  path_full: string;
  path_thumbnail: string;
};

export type SupportInfo = {
  email: string;
  url: string;
};
