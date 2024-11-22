import {
  GithubAuthConfig,
  GithubTokenResponse,
  GithubUserResponse,
} from './auth.interface';
import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { User } from './auth.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private users: User[] = []; // 这里用数组模拟数据库，实际应该使用真实数据库
  private readonly githubConfig: GithubAuthConfig;

  @Inject(JwtService)
  private jwtService: JwtService;

  constructor() {
    this.githubConfig = {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackUrl: process.env.GITHUB_CALLBACK_URL,
      scope: ['user:email'],
    };
  }

  getGithubAuthUrl(): string {
    const baseUrl = 'https://github.com/login/oauth/authorize';
    const params = new URLSearchParams({
      client_id: this.githubConfig.clientId,
      redirect_uri: this.githubConfig.callbackUrl,
      scope: this.githubConfig.scope.join(' '),
    });

    return `${baseUrl}?${params.toString()}`;
  }

  async getGithubToken(code: string): Promise<GithubTokenResponse> {
    const response = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: this.githubConfig.clientId,
          client_secret: this.githubConfig.clientSecret,
          code,
        }),
      },
    );

    if (!response.ok) {
      throw new HttpException(
        'Failed to get GitHub token',
        HttpStatus.BAD_REQUEST,
      );
    }

    return response.json();
  }

  async getGithubUser(accessToken: string): Promise<GithubUserResponse> {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new HttpException(
        'Failed to get GitHub user',
        HttpStatus.BAD_REQUEST,
      );
    }

    return response.json();
  }

  async findOrCreateUser(githubUser: GithubUserResponse): Promise<User> {
    let user = this.users.find((u) => u.githubId === githubUser.id);

    if (!user) {
      user = {
        id: this.users.length + 1,
        githubId: githubUser.id,
        email: githubUser.email,
        username: githubUser.login,
        avatarUrl: githubUser.avatar_url,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.users.push(user);
    } else {
      user.email = githubUser.email;
      user.username = githubUser.login;
      user.avatarUrl = githubUser.avatar_url;
      user.updatedAt = new Date();
    }

    return user;
  }

  async generateJwtToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      username: user.username,
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });
  }
}
