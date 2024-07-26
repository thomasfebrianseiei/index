import { Request } from "express";
import { User } from "src/modules/users/user.entity";

export class VRequest extends Request {
    user?: User
}