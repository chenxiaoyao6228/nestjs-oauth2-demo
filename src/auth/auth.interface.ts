export interface GithubAuthConfig {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  scope?: string[];
}

export interface GithubUserResponse {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
}

export interface GithubTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

export interface User {
  id: number;
  githubId: number;
  email: string;
  username: string;
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;
}
