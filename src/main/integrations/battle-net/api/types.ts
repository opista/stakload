export interface TokenResponse {
  access_token: string;
  error?: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
}

export interface BattleNetTokenConfig {
  accessToken: string;
  expiresAt: number;
  refreshToken: string;
}
