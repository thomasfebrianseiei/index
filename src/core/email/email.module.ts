import { Module } from '@nestjs/common';
import { emailService } from './email.service';

@Module({
    providers: [emailService],
    exports: [emailService],
})
export class EmailModule { }
