import {
  Injectable,
  Inject,
  NotFoundException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { User } from './user.entity';
import { UserDto, getAllUserDto, UserEditDto } from './dto/user.dto';
import { USER_REPOSITORY } from '../../core/constants';
import { Op } from 'sequelize';
import { UserDetail } from './entity/userdetail.entity';
import { getStartDate } from './helpers/getStartDate';
import axios from 'axios';
import { messaging } from 'firebase-admin';
const { formatDistanceToNow } = require('date-fns');
const { id } = require('date-fns/locale');
const { getCustomLocale } = require('./helpers/customLocale');

@Injectable()
export class UsersService {
  constructor(@Inject(USER_REPOSITORY) private userRepository: typeof User) { }

  async create(user: UserDto): Promise<User> {
    try {
      return await this.userRepository.create(user);
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw error;
    }
  }


  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOne<User>({ where: { email } });
    } catch (error) {
      console.error('Error finding user by email:', error.message);
      throw error;
    }
  }

  async findOneByPhone(phone: string): Promise<User> {
    try {
      return await this.userRepository.findOne<User>({ where: { phone } });
    } catch (error) {
      console.error('Error finding user by phone:', error.message);
      throw error;
    }
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOne<User>({
        where: { id },
      });
    } catch (error) {
      console.error('Error finding user by ID:', error.message);
      throw error;
    }
  }


  async updateById(user_id: string, updateUserDto: UserEditDto): Promise<any> {
    try {
      const user = await this.findOneById(user_id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Update only the specified fields of the user
      const updatedUser: any = await this.userRepository.update(updateUserDto, {
        where: { id: user_id },
      });
      if (updatedUser) {
        return { massage: 'data berhasil di update' };
      }
    } catch (error) {
      console.error('Error updating user by ID:', error.message);
      throw error;
    }
  }

  async updateValid(user_id: string): Promise<any> {
    try {
      const user = await this.findOneById(user_id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Update only the specified fields of the user
      const updatedUser: any = await this.userRepository.update(
        { is_valid: true },
        { where: { id: user_id } },
      );
      if (updatedUser) {
        return { massage: 'data berhasil di update' };
      }
    } catch (error) {
      console.error('Error updating user by ID:', error.message);
      throw error;
    }
  }

  async updatePasswordById(
    id: string,
    newPassword: string,
  ): Promise<{ message: string }> {
    try {
      const user = await this.findOneById(id);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      console.log('User found:', user);

      const [numberOfAffectedRows] = await this.userRepository.update(
        { password: newPassword },
        { where: { id } },
      );

      if (numberOfAffectedRows === 0) {
        throw new InternalServerErrorException('Failed to update password');
      }
      console.log(" message: 'Password updated successfully' ");
      return { message: 'Password updated successfully' };
    } catch (error) {
      console.error('Error updating user password by ID:', error.message);
      throw error;
    }
  }

  async deleteById(id: string): Promise<any> {
    try {
      const user = await this.userRepository.findOne<User>({ where: { id } });
      // console.log("user :", user)
      if (!user) {
        throw new NotFoundException('User not found');
      }
      // Delete the user
      await this.userRepository.destroy({ where: { id } });

      return { massage: 'data berhasil di hapus' };
    } catch (error) {
      console.error('Error deleting user by ID:', error.message);
      throw error;
    }
  }

  async allUsers(payload: getAllUserDto) {
    try {
      const offset = (payload.page - 1) * payload.pageSize;
      let result: any;
      if (payload.search) {
        result = await this.userRepository.findAndCountAll({
          attributes: { exclude: ['password'] },
          where: { username: { [Op.iLike]: `%${payload.search}%` } },
          limit: payload.pageSize,
          offset: offset,
        });
      } else {
        result = await this.userRepository.findAndCountAll({
          attributes: { exclude: ['password'] },
          limit: payload.pageSize,
          offset: offset,
        });
      }
      const totalItems = result.count;
      const totalPages = Math.ceil(totalItems / payload.pageSize);
      let page = payload.page;
      let pageSize = payload.pageSize;
      return {
        result: result.rows,
        pagination: {
          page,
          pageSize,
          totalItems,
          totalPages,
        },
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }


}
