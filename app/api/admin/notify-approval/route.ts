import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const { email, name } = await req.json();

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Your exAi Account has been Approved!',
            text: `
                Hello ${name},
                
                Your account for exAi has been approved!
                
                You can now log in to the platform at: https://app.userex.com.tr/login
                
                Best regards,
                The exAi Team
            `,
            html: `
                <h3>Welcome to exAi!</h3>
                <p>Hello ${name},</p>
                <p>Your account has been approved!</p>
                <p>You can now log in to the platform at: <a href="https://app.userex.com.tr/login">https://app.userex.com.tr/login</a></p>
                <br/>
                <p>Best regards,</p>
                <p>The exAi Team</p>
            `
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending approval email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
