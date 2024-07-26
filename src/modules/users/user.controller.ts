import {
  Controller,
  UseGuards,
  Res,
  Get,
  Query,
  Delete,
  Put,
  Body,
  Post,
  HttpStatus,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { getAllUserDto, UserEditDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserKycDto } from './dto/userKyc.dto';
import { CreateBankDto, UpdateBankDto } from './dto/bank.dto';
import { EditContactDto, EditPersonalDataDto } from './dto/userDetail.dto';

import { UserValidationFantazieDto } from './dto/loginFtz.dto';

@Controller('user')
export class UserController {
  constructor(
    private usersService: UsersService,
  ) { }

  @Get('get/all')
  @UseGuards(AuthGuard('jwt'))
  async getAll(@Query() query: getAllUserDto, @Res() res: Response) {
    try {
      const output = await this.usersService.allUsers(query);
      return res.json(output);
    } catch (error) {
      throw error;
    }
  }


  @Delete('delete')
  @UseGuards(AuthGuard('jwt'))
  async delUser(@Query() query: { user_id: string }) {
    try {
      return await this.usersService.deleteById(query.user_id);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


  @Put('edit')
  @UseGuards(AuthGuard('jwt'))
  async editUser(
    @Query() query: { user_id: string },
    @Body() body: UserEditDto,
  ) {
    try {
      return await this.usersService.updateById(query.user_id, body);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get('get')
  @UseGuards(AuthGuard('jwt'))
  async getOne(@Query() id_user: string, @Res() res: Response) {
    try {
      const output = await this.usersService.findOneById(id_user);
      return res.json(output);
    } catch (error) {
      // console.log(error);
      throw error;
    }
  }




}
