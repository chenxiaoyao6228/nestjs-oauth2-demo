import { AuthService } from './auth.service';
import { Controller, Get, Query, Redirect, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('github/login')
  @Redirect()
  async githubAuth() {
    const url = this.authService.getGithubAuthUrl();
    return { url, statusCode: 302 };
  }

  @Get('github/callback')
  async githubCallback(@Query('code') code: string, @Res() response: Response) {
    try {
      // 1. 获取 GitHub token
      const tokenResponse = await this.authService.getGithubToken(code);

      // 2. 获取用户信息
      const githubUser = await this.authService.getGithubUser(
        tokenResponse.access_token,
      );

      // 3. 创建或更新用户信息
      const user = await this.authService.findOrCreateUser(githubUser);

      // 4. 生成 JWT token
      const jwtToken = await this.authService.generateJwtToken(user);

      // 5. 设置 cookie
      response.setHeader(
        'Set-Cookie',
        `auth_token=${jwtToken}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60 * 1000}`,
      );
      response.cookie('auth_token', jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // 在生产环境使用 HTTPS
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7天有效期
      });

      // 6. 重定向到前端页面
      return response.redirect(`/auth-success.html?token=${jwtToken}`);
    } catch (error) {
      console.error('autherror', error);
      // 处理错误情况
      return response.redirect(`/auth-error.html?message=${error.message}`);
    }
  }
}
