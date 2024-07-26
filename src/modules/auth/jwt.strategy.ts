import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UsersService) {
        // console.log("validate", "JwtStrategy")
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.token;
                },
            ]),
            //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWTKEY,
        });
    }

    async validate(payload: any) {
        // check if user in the token actually exist
        // console.log("asasasas", payload)
        const user = await this.userService.findOneById(payload.id);
        // console.log('masukkkkkkk', user.dataValues)
        if (!user) {
            throw new UnauthorizedException(
                'You are not authorized to perform the operation',
            );
        }
        return payload;
    }
}