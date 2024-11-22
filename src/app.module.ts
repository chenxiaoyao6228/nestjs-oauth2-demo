import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthPassportModule } from './auth-passport/auth-passport.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 使配置在整个应用程序中可用
    }),
    AuthModule,
    AuthPassportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
