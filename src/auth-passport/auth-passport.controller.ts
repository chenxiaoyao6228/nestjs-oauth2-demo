import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthPassportService } from './auth-passport.service';

@Controller('auth-passport')
export class AuthPassportController {
  constructor(private authService: AuthPassportService) {}

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubAuth() {
    // Guard will handle the redirection
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req: any, @Res() res: Response) {
    const token = await this.authService.login(req.user);
    res.redirect(`/auth-success.html?token=${token}`);
  }
}
