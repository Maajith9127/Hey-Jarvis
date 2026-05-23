import nodemailer from 'nodemailer';
import User from '../../../models/UserCollection.js';
import { verifyAccountability } from '../../../routes/SavingFunctions/OtherHelperFunctions/VerifyAccountability.js';
import { format } from 'date-fns';

export const sendRandomAccEventReminder = async (userId, accEvent) => {
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

    // Defensive defaults
    const eventTitle = accEvent.title || "Accountability Event";
    const timeSlot =
      accEvent.timeSlot ||
      `${format(new Date(accEvent.start), 'hh:mma')} - ${format(new Date(accEvent.end), 'hh:mma')} / ${format(new Date(accEvent.start), 'd/M/yyyy')}`;

    const mailOptions = {
      from: `"Hey Jarvis" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: " Randomised Accountability Challenge Started!",
      html: `
        <h2>Hi ${user.name || 'there'} </h2>
        <p>Your accountability event just went <strong>LIVE</strong>!</p>
        <ul>
          <li><strong>Title:</strong> ${eventTitle}</li>
          <li><strong>Time Slot:</strong> ${timeSlot}</li>
        </ul>
        <p>Head over to your <a href="https://your-jarvis-domain.com">Jarvis dashboard</a> to complete it!</p>
        <br />
        <p>Keep grinding  — Jarvis Team</p>
      `
    };

    let attempt = 0;
    const maxAttempts = 5;
    let success = false;

    while (attempt < maxAttempts) {
      try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Reminder mail sent to: ${user.email}`);
        success = true;
        break;
      } catch (sendErr) {
        attempt++;
        console.warn(`❌ Attempt ${attempt} failed to send email:`, sendErr.message);
        if (attempt === maxAttempts) {
          console.error("❌ All retry attempts failed. Giving up.");
        } else {
          const waitTime = 1000 * Math.pow(2, attempt); // 1s, 2s, 4s, 8s, 16s
          console.log(`🔁 Retrying in ${waitTime / 1000} seconds...`);
          await new Promise(res => setTimeout(res, waitTime));
        }
      }
    }

    //  Fallback: mark as verified if mail never sent
    if (!success) {
      console.log("📉 Email failed. Marking as verified (fallback).");

      const result = await verifyAccountability({
        VerificationResult: "1",
        Accountability: accEvent,
        userId
      });

      if (result?.success) {
        console.log(" Accountability marked as verified via fallback.");
      } else {
        console.warn(" Fallback verification failed.");
      }
    }

  } catch (err) {
    console.error(" Failed to process randomised reminder email:", err);
  }
};
