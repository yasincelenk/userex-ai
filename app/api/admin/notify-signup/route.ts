import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const { email, name, company } = await req.json();

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
            to: 'info@userex.com.tr',
            subject: `New User Signup: ${email}`,
            text: `
                New user signup details:
                
                Name: ${name}
                Email: ${email}
                Company: ${company || 'N/A'}
                
                Please review and approve in the admin panel.
            `,
            html: `
                <h3>New User Signup</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Company:</strong> ${company || 'N/A'}</p>
                <p>Please review and approve in the admin panel.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error sending signup email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
