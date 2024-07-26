/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    Controller,
    Body,
    Post,
    UseGuards,
    Request,
    Res,
    Get,
    Req,
    UnauthorizedException,
    Query,
    BadRequestException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/user.dto';
import { DoesUserExist } from '../../core/guards/doesUserExist.guard';
import { BasicAuthGuard } from './local.strategy';
import { changePasswordDto } from './dto/auth.dto';
import { VRequest } from 'src/core/interfaces/express';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @UseGuards(BasicAuthGuard)
    async login(@Request() req, @Res() res: Response) {
        try {
            const output = await this.authService.login(req.user);
            // console.log(output);
            res.cookie('token', output.token, {
                httpOnly: true,
                secure: true, // Keep this true if your API is HTTPS
                sameSite: 'none', // This allows cross-site cookie setting
                path: '/',
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
            });
            return res.json(output); // Send the output as JSON response
        } catch (error) {
            // console.log(error);
            throw error;
        }
    }

    @UseGuards(DoesUserExist)
    @Post('signup')
    async signUp(@Body() body: UserDto, @Req() req) {
        try {
            body.is_valid = false;
            return await this.authService.create(body);
        } catch (error) {
            // console.log(error)
            console.error(error);
            throw error;
        }
    }

    @Get('')
    @UseGuards(AuthGuard('jwt'))
    async authenticate(@Request() req: VRequest, @Res() res: Response) {
        try {
            const { id, username, email, phone } = req.user;
            return res.status(200).json({ id, username, email, phone });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred' });
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('change-password')
    async changePassword(
        @Request() req,
        @Body() body: changePasswordDto,
        @Res() res: Response,
    ) {
        try {
            const userId = req.user.id; // Assuming you have a user object in the request
            const { oldPassword, newPassword } = body;

            await this.authService.changePassword(userId, oldPassword, newPassword);

            // Respond with a success message or any other desired response
            res.cookie('token', '', {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                expires: new Date(),
            });

            return res.status(200).json({ message: 'Password changed successfully' });
        } catch (error) {
            console.error(error);
            // Handle the error appropriately, e.g., return an error response
            return res
                .status(500)
                .json({ error: 'An error occurred while changing password' });
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('logout')
    async logout(@Res() res: Response): Promise<any> {
        try {
            res.cookie('token', '', {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                expires: new Date(),
            });
            res.status(200).json({ data: 'Logged out' });
        } catch (error) {
            return res.status(500).json({ error: 'An error occurred' });
        }
    }

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth(@Req() req: Request) {
        // This will initiate the Google OAuth2 login flow
    }

    @Post('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
        try {
            const user: any = req; // This user object comes from Passport Google strategy

            console.log('SSSSSSS', user);
            // Optional: Generate a JWT token
            const token = await this.authService.login(user.user);

            // Set the JWT token in a cookie
            res.cookie('token', token.token, {
                httpOnly: true,
                //secure: true, // Ensure this matches your environment (true for production with HTTPS)
                //sameSite: 'lax', // Adjust this as needed
            });

            // Redirect to your frontend application or return user data
            return res.json(token); // Replace with your frontend URL
        } catch (error) {
            console.error('Error during Google authentication:', error.message);
            return res
                .status(500)
                .json({ error: 'An error occurred during Google authentication' });
        }
    }

    @Get('verify-email')
    @UseGuards(AuthGuard('JwtStrategyEmail'))
    async verifyEmail(
        @Query('token') token: string,
        @Res() res: Response,
        @Req() req: Request,
    ) {
        try {
            const data: any = req; // This user object comes from JwtStrategy

            const user = data.user;

            console.log('passs', user);
            if (!user) {
                throw new UnauthorizedException('Invalid token');
            }
            //console.log("sssssssssssss", token)

            await this.authService.verifyEmailUpdate(user.id); // Ensure updateUser method exists in AuthService

            // Redirect to your frontend application after verification
            return res.redirect(`https://fantek.id/verification?token=${token}`); // Replace with your frontend URL
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    @Post('forgot-password')
    async forgotPassword(@Body() ForgotPasswordDto: ForgotPasswordDto) {
        try {
            console.log("sssssssssssssssssssssssssssss", ForgotPasswordDto)
            await this.authService.sendPasswordResetEmail(ForgotPasswordDto);
            return { message: 'Password reset email sent' };
        } catch (error) {
            throw error;
        }
    }
    @Post('reset-password')
    @UseGuards(AuthGuard('JwtStrategyEmail'))
    async resetPassword(
        @Query('token') token: string,
        @Body() resetPasswordDto: ResetPasswordDto,
        @Res() res: Response,
        @Req() req: Request,
    ) {
        try {
            console.log("Entering reset password");

            const data: any = req; // This user object comes from JwtStrategy
            //console.log(data.user.dataValues, resetPasswordDto.newPassword);

            const user = data.user.dataValues;
            const result = await this.authService.resetPassword(resetPasswordDto.newPassword, user.email);
            console.log("Password reset result:", result);

            res.cookie('token', '', {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                expires: new Date(),
            });

            return res.json(result); // Ensure the response is sent back properly
        } catch (error) {
            console.error('Error during password reset:', error);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }


    @UseGuards(AuthGuard('jwt'))
    @Get('send-otp/email')
    async sendOtp(@Req() req) {
        try {
            await this.authService.sendOtpEmail(req.user.email);
            return { message: 'OTP sent to your email' };
        } catch (error) {
            throw error;
        }
    }

    // New endpoint for verifying OTP
    @UseGuards(AuthGuard('jwt'))
    @Post('verify-otp/email')
    async verifyOtpEmail(
        @Req() req,
        @Body('otp') otp: string
    ) {
        try {
            await this.authService.verifyOtpEmail(req.user.email, otp);
            return { message: 'OTP verified successfully' };
        } catch (error) {
            throw error;
        }
    }
}


