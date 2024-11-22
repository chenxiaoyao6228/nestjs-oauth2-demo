import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthPassportService {
  constructor(private jwtService: JwtService) {}

  async validateUser(profile: any) {
    // Here you would typically:
    // 1. Find user in database
    // 2. Create user if doesn't exist
    // 3. Return user object
    return {
      id: profile.githubId,
      email: profile.email,
      username: profile.username,
    };
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return this.jwtService.sign(payload);
  }
}
