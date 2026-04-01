import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const testEmail = async () => {
  try {
    console.log("Testing with USER:", process.env.SMTP_USER);
    console.log("Testing with PASS:", (process.env.SMTP_PASS || "").replace(/\s/g, ""));
    
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: (process.env.SMTP_PASS || "").replace(/\s/g, ""),
      },
      debug: true, // show debug output
      logger: true // log information into console
    });

    console.log("Verifying connection...");
    await transporter.verify();
    console.log("Connection verified successfully!");

    console.log("Sending test email...");
    const info = await transporter.sendMail({
      from: `"Royal Property Finder" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // send to self
      subject: "Direct Test Email",
      text: "This is a test email sent directly from the testing script.",
    });

    console.log("Email sent successfully! Message ID:", info.messageId);
  } catch (error) {
    console.error("FAILED TO SEND EMAIL:");
    console.error(error);
  }
};

testEmail();
