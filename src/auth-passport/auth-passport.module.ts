import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthPassportController } from './auth-passport.controller';
import { GithubStrategy } from './github.strategy';
import { AuthPassportService } from './auth-passport.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'github' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthPassportController],
  providers: [AuthPassportService, GithubStrategy],
})
export class AuthPassportModule {}
