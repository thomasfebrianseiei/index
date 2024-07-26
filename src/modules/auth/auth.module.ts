import { Module } from '@nestjs/common';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { BasicAuthGuard, LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategyEmail } from './jwt.strategy.email';
import { EmailModule } from '../../core/email/email.module';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    EmailModule,
    JwtModule.register({
      secret: process.env.JWTKEY,
      signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtStrategyEmail,
    BasicAuthGuard,
    GoogleStrategy
  ],
  controllers: [AuthController],
})
export class AuthModule { }
