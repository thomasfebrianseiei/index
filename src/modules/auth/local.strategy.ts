// import { Strategy } from 'passport-local';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Req } from '@nestjs/common';

import { AuthService } from './auth.service';
import { Strategy } from 'passport-custom';
import { Request } from 'express';


@Injectable()
export class BasicAuthGuard extends AuthGuard('local-lop') { }

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local-lop') {

    constructor(private readonly authService: AuthService) {
        super();
    }

    async validate(@Req() req: Request): Promise<any> {
        // console.log(req.body);
        let input: any = req.body
        const user = await this.authService.validateUser(input.email, input.password);
        if (!user) {
            throw new UnauthorizedException('Invalid user credentials');
        } else if (user === "not valid") {
            throw new UnauthorizedException('you have not verified your email');
        }
        return user;
    }
}
