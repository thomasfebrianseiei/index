import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategyEmail extends PassportStrategy(Strategy, "JwtStrategyEmail") {
    constructor(private readonly userService: UsersService) {
        console.log("masuk")
        super({
            jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'), // Extract token from query parameter
            ignoreExpiration: false,
            secretOrKey: process.env.JWTKEY,
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.userService.findOneByEmail(payload.email);
        if (!user) {
            throw new UnauthorizedException('Invalid token');
        }
        return user;
    }
}
