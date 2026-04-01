import nodemailer from "nodemailer";

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
  html?: string;
}

export const sendEmail = async (options: EmailOptions) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      // Gmail App Passwords are displayed with spaces but must be used without
      pass: (process.env.SMTP_PASS || "").replace(/\s/g, ""),
    },
  });

  // 2) Define the email options
  const mailOptions = {
    from: `"Royal Property Finder - No Reply" <${process.env.SMTP_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
    replyTo: "noreply@royalpropertyfinder.com", // Prevents users from replying to the automated email
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};
