import nodemailer from 'nodemailer'
import dotenv from "dotenv";


dotenv.config();

class OtpService {

    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    async sendOtp(email: string, otp: string) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Signup otp',
            text: `Your OTP code for signing-up is ${otp}. It is valid for 60 seconds.`,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`OTP email sent to ${email}`);
        } catch (error) {
            console.error('Error sending OTP email:', error);
            throw new Error('Could not send OTP email');
        }
    }
}


export const otpService = new OtpService();