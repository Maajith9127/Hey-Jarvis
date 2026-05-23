import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendMailPenalty = async ({ ToAddress, message, AccountabilityId }) => {
    console.log(` Sending penalty email to: ${ToAddress} | Accountability ID: ${AccountabilityId}`);

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        //  Paste your Cloudinary link here
        
        const penaltyUrl = "https://res.cloudinary.com/dhqlifldp/image/upload/v1757234248/dwmwwmbpset3mgedroqa.jpg";

        const mailOptions = {
            from: `"Hey Jarvis" <${process.env.MAIL_USER}>`,
            to: ToAddress,
            subject: "Maajiths Embarrassing Penalty Inside!",
            text: `"${message}" - from Jarvis\n\nPenalty ID: ${AccountabilityId}\n\nView your penalty here: ${penaltyUrl}`,
            html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2>⏰ Accountability Alert</h2>
                    <p><b>Message:</b> ${message}</p>
                    <p><b>Accountability ID:</b> ${AccountabilityId}</p>
                    <p>
                        <a href="${penaltyUrl}" target="_blank" style="color: #1a73e8; text-decoration: underline;">
                            🔗 Click here to view your penalty
                        </a>
                    </p>
                    <p style="margin-top: 20px; font-size: 12px; color: gray;">
                        Sent automatically by Hey Jarvis Accountability System.
                    </p>
                </div>
            `,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(" Email sent successfully:", result.response);
    } catch (error) {
        console.error(" Failed to send penalty email:", error.message);
    }
};
