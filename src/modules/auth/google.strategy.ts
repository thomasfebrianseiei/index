import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { AuthService } from './auth.service';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    private client: OAuth2Client;

    constructor(private readonly authService: AuthService) {
        super();
        this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }

    async validate(req: any, done: (error: any, user?: any, info?: any) => void): Promise<any> {
        const idToken = req.body.id_token;
        console.log("sssssssssssssssssssssssss", idToken)
        if (!idToken) {
            throw new UnauthorizedException('ID token is missing');
        }

        try {
            const ticket = await this.client.verifyIdToken({
                idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            });

            const payload = ticket.getPayload();
            if (!payload) {
                throw new UnauthorizedException('Invalid token payload');
            }

            const user = {
                email: payload.email,
                firstName: payload.given_name,
                lastName: payload.family_name,
                picture: payload.picture,
                googleId: payload.sub,
                emailVerified: payload.email_verified,
            };

            const validatedUser = await this.authService.validateGoogleUser(user);
            if (!validatedUser) {
                throw new UnauthorizedException('User validation failed');
            }

            done(null, validatedUser);
        } catch (error) {
            done(error, false);
        }
    }
}
