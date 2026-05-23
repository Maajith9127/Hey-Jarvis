import nodemailer from 'nodemailer';
import User from '../../../models/UserCollection.js';

export const sendPenaltyNotification = async (userId, AccountabilityId, collectionType) => {
    try {
        const user = await User.findById(userId);
        if (!user || !user.email) {
            console.warn(" No email found for user:", userId);
            return;
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        const mailOptions = {
            from: `"Hey Jarvis" <${process.env.MAIL_USER}>`,
            to: user.email,
            subject: "Penalty Applied",
            html: `
        <h2>Hi ${user.name || 'there'},</h2>
        <p>You missed an accountability event and a penalty has been triggered.</p>
        <ul>
          <li><strong>Accountability ID:</strong> ${AccountabilityId}</li>
          <li><strong>Collection Type:</strong> ${collectionType}</li>
        </ul>
        <p>Stay disciplined and avoid penalties next time!</p>
        <br />
        <p>— Jarvis Team</p>
      `
        };

        await transporter.sendMail(mailOptions);
        console.log(`📧 Penalty notification sent to: ${user.email}`);
    } catch (err) {
        console.error("❌ Failed to send penalty notification:", err);
    }
};
