/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { emailService } from '../../core/email/email.service';
import { UserDetailDto } from '../users/dto/userDetail.dto';
import { ForgotPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  private otpStore: Map<string, { otp: string; expires: number }> = new Map();

  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: emailService,
  ) { }

  async validateGoogleUser(user: any) {
    console.log(user);
    const existingUser = await this.userService.findOneByEmail(user.email);
    if (existingUser) {
      const { password, ...result } = existingUser['dataValues'];
      return result;
    }

    console.log('masuk');

    const newUser: UserDto = {
      username: `${user.firstName} ${user.lastName}`,
      email: user.email,
      password: null,
      phone: null,
      is_valid: true,
    };
    let output = await this.userService.create(newUser);
    const { password, ...result } = output['dataValues'];
    console.log('masuk2');

    return result;
  }

  async validateUser(email: string, pass: string) {
    try {
      // find if user exists with this email
      const user = await this.userService.findOneByEmail(email);
      if (!user) {
        return null;
      }

      // check if user is valid
      if (!user.is_valid) {
        return 'not valid';
      }

      // check if user password matches
      const match = await this.comparePassword(pass, user.password);
      if (!match) {
        return null;
      }

      // return user data without password
      const { password, ...result } = user['dataValues'];
      return result;
    } catch (error) {
      console.error('Error validating user:', error.message);
      throw error;
    }
  }

  public async login(user) {
    try {
      console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaa', user);
      const token = await this.generateToken(user);

      return { user, token };
    } catch (error) {
      console.error('Error during login:', error.message);
      throw error;
    }
  }

  public async create(user) {
    try {
      // hash the password

      const pass = await this.hashPassword(user.password);

      // create the user
      const newUser = await this.userService.create({
        ...user,
        password: pass,
      });

      const senderID = newUser.id.match(/\d+/g).join('').slice(0, 8);

      // --------------update sender id------------

      // create user detail
      const userDetailPayload = new UserDetailDto();
      userDetailPayload.user_id = newUser.id;


      const { password, ...result } = newUser['dataValues'];

      await this.sendVerificationEmail(result);

      // generate token
      const message = 'Please check your email for validation';

      //   return the user and the token
      return { user: result, message };
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw error;
    }
  }

  private async generateToken(user) {
    try {
      const token = await this.jwtService.signAsync(user);
      return token;
    } catch (error) {
      console.error('Error generating token:', error.message);
      throw error;
    }
  }

  private async hashPassword(password) {
    try {
      const hash = await bcrypt.hash(password, 10);
      return hash;
    } catch (error) {
      console.error('Error hashing password:', error.message);
      throw error;
    }
  }

  private async comparePassword(enteredPassword, dbPassword) {
    try {
      const match = await bcrypt.compare(enteredPassword, dbPassword);
      return match;
    } catch (error) {
      console.error('Error comparing passwords:', error.message);
      throw error;
    }
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<any> {
    try {
      // Retrieve the user from the database
      const user = await this.userService.findOneById(userId);

      // Verify if the old password matches the user's current password
      const passwordMatches = await this.comparePassword(
        oldPassword,
        user.password,
      );

      if (!passwordMatches) {
        throw new UnauthorizedException('Old password is incorrect');
      }

      // Hash the new password
      const hashedNewPassword = await this.hashPassword(newPassword);

      // Update the user's password with the new hashed password
      await this.userService.updatePasswordById(userId, hashedNewPassword);

      // Return a success message
      return { message: 'Password updated successfully' };
    } catch (error) {
      console.error('Error changing password:', error.message);
      throw error;
    }
  }

  async verifyEmailUpdate(userId: string): Promise<any> {
    try {
      await this.userService.updateValid(userId);
      return { message: 'Email verified successfully' };
    } catch (error) {
      throw new BadRequestException("can't update");
    }
  }

  private async sendVerificationEmail(user: any) {
    const token = await this.generateToken(user);
    const verificationLink = `http://localhost:5000/api/v1/auth/verify-email?token=${token}`;
    const subject = 'Email Verification';
    const bodyText = `Please verify your email by clicking on the following link: ${verificationLink}`;
    const bodyHtml = `<p>Please verify your email by clicking on the following link: <a href="${verificationLink}">Verify Email</a></p>`;
    const output = await this.emailService.sendEmail(
      user.email,
      subject,
      bodyText,
      bodyHtml,
      'Email Verification',
    );
    console.log(output);
  }

  async sendPasswordResetEmail(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userService.findOneByEmail(forgotPasswordDto.email);
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    const token = await this.generateToken({ email: user.email });
    console.log(token);
    const resetLink = `https://fantek.id/forgot-password?token=${token}`;
    const subject = 'Password Reset';
    const bodyText = `Please reset your password by clicking on the following link: ${resetLink}`;
    const bodyHtml = `<p>Please reset your password by clicking on the following link: <a href="${resetLink}">Reset Password</a></p>`;

    await this.emailService.sendEmail(
      user.email,
      subject,
      bodyText,
      bodyHtml,
      'Password Reset',
    );
  }

  async resetPassword(newPassword: string, email: string) {
    try {
      const user: any = await this.userService.findOneByEmail(email);

      // console.log(newPassword, email, user.dataValues.id);
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      const hashedPassword = await this.hashPassword(newPassword);
      // console.log(hashedPassword)
      const output = await this.userService.updatePasswordById(
        user.dataValues.id,
        hashedPassword,
      );
      console.log(output);
      return { message: 'Password updated successfully' };
    } catch (error) {
      console.error('Error resetting password:', error);

      // Re-throw the error if it's a known error type
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      // Optionally handle other error types here or re-throw a generic error
      throw new InternalServerErrorException(
        'An error occurred while resetting the password',
      );
    }
  }

  async sendOtpEmail(email: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    const otp = this.generateOtp();
    const expires = Date.now() + 2 * 60 * 1000; // OTP valid for 10 minutes

    this.otpStore.set(email, { otp, expires });

    const subject = 'Your OTP Code';
    const bodyText = `Your OTP code is ${otp}. It is valid for 2 minutes.`;
    const bodyHtml = `<p>Your OTP code is <strong>${otp}</strong>. It is valid for 2 minutes.</p>`;

    await this.emailService.sendEmail(
      email,
      subject,
      bodyText,
      bodyHtml,
      'OTP Code',
    );

    return { message: 'OTP sent to your email' };
  }

  async verifyOtpEmail(email: string, otp: string) {
    const otpData = this.otpStore.get(email);

    if (!otpData || otpData.expires < Date.now()) {
      this.otpStore.delete(email);
      throw new BadRequestException('OTP is invalid or expired');
    }

    if (otpData.otp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    this.otpStore.delete(email); // Remove OTP after successful verification

    return { message: 'OTP verified successfully' };
  }

  private generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
  }
}
