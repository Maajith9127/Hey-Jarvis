// Notifications/crashNotifier.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export async function sendCrashMail() {
    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER, // use MAIL_USER from .env
                pass: process.env.MAIL_PASS, // use MAIL_PASS from .env
            },
        });

        // Mail options
        const mailOptions = {
            from: `"Hey Jarvis" <${process.env.MAIL_USER}>`,
            to: "maajithanas@gmail.com",
            subject: "Server Crash Notification",
            text: "Sorry Server Crashed, But don't worry. No penalties for you.",
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log("Crash notification sent:", info.response);
    } catch (error) {
        console.error("Error sending crash email:", error);
    }
}
