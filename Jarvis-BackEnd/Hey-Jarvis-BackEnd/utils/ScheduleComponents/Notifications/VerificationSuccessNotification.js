import nodemailer from 'nodemailer';
import User from '../../../models/UserCollection.js';
import { format } from 'date-fns';

export const sendVerificationSuccessNotification = async (userId, accEvent) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.email) {
      console.warn("⚠️ No email found for user:", userId);
      return;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const timeSlot =
      accEvent.timeSlot ||
      `${format(new Date(accEvent.start), 'hh:mma')} - ${format(new Date(accEvent.end), 'hh:mma')} / ${format(new Date(accEvent.start), 'd/M/yyyy')}`;

    const mailOptions = {
      from: `"Hey Jarvis" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: "✅ Verification Successful!",
      html: `
        <h2>Hi ${user.name || 'there'}</h2>
        <p>Congratulations! You successfully completed your accountability event.</p>
        <ul>
          <li><strong>Title:</strong> ${accEvent.title || "Accountability Event"}</li>
          <li><strong>Time Slot:</strong> ${timeSlot}</li>
        </ul>
        <p>Keep up the discipline!</p>
        <br />
        <p>— Jarvis Team</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Verification success mail sent to: ${user.email}`);
  } catch (err) {
    console.error("❌ Failed to send verification success mail:", err);
  }
};
