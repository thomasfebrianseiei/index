import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';

import { UsersService } from '../../modules/users/users.service';

@Injectable()
export class DoesUserExist implements CanActivate {
    constructor(private readonly userService: UsersService) { }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return this.validateRequest(request);
    }

    async validateRequest(request) {
        const { email, phone } = request.body;

        // Check if user with the provided email exists
        const userByEmail = await this.userService.findOneByEmail(email);
        if (userByEmail) {
            throw new ForbiddenException('This email already exists');
        }

        // Check if user with the provided phone number exists
        const userByPhone = await this.userService.findOneByPhone(phone);
        if (userByPhone) {
            throw new ForbiddenException('This phone number already exists');
        }

        return true;
    }
}
