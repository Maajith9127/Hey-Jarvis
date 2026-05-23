import nodemailer from "nodemailer";
import User from "../../../models/UserCollection.js";

export const sendCustomNotification = async (userId, subject, messageHtml) => {
  try {
    const user = await User.findById(userId);
    if (!user || !user.email) {
      console.warn("No email found for user:", userId);
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Hey Jarvis" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject,
      html: `
        <h2>Hi ${user.name || "there"},</h2>
        ${messageHtml}
        <br />
        <p>— Jarvis Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(` Custom notification sent to: ${user.email} (Subject: ${subject})`);
  } catch (err) {
    console.error(" Failed to send custom notification:", err);
  }
};
