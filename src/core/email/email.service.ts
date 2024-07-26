// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class emailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }

    public async sendEmail(to: string, subject: string, bodyText: string, bodyHtml: string, name: string) {
        const mailOptions = {
            from: `"${name}" <${process.env.MAIL_USER}>`,
            to,
            subject,
            text: bodyText,
            html: bodyHtml,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
            return info;
        } catch (error) {
            console.log('Error sending email:', error);
            throw error;
        }
    }
}
