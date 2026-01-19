import nodemailer from 'nodemailer';

const port = parseInt(process.env.SMTP_PORT || '587');
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'user',
        pass: process.env.SMTP_PASS || 'pass'
    }
});

interface SendEmailProps {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailProps) => {
    try {
        const fromAddress = process.env.SMTP_USER || 'info@renace.space';

        if (!process.env.SMTP_USER) {
            console.warn("⚠️ SMTP_USER env var is missing, using fallback:", fromAddress);
        }

        const info = await transporter.sendMail({
            from: fromAddress,
            to,
            subject,
            html,
        });

        console.log("📨 Email sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("🔗 Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending email:", error);
        // In dev mode without real creds, we just log and pretend it worked
        if (process.env.NODE_ENV !== 'production') {
            console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}`);
            return { success: true, mocked: true };
        }
        return { success: false, error };
    }
};
