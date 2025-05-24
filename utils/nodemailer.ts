import nodemailer from "nodemailer";

interface EmailOptions {
  from: string;
  recipients: string[]; // Bulk recipient list
  subject: string;
  text?: string;
  html?: string;
  delayBetweenEmails?: number; // Optional delay in milliseconds
}

const transporter = nodemailer.createTransport({
  service: "gmail", // Change to your SMTP provider
  auth: {
    user: "guetestmailnoreply@gmail.com",
    pass: "awtsguegue12345",
  },
});

/**
 * Sends bulk emails with optional delay
 * @param options EmailOptions object containing recipient list and email details
 */
export const sendBulkEmails = async (options: EmailOptions): Promise<void> => {
  for (const recipient of options.recipients) {
    try {
      const mailOptions = {
        from: options.from,
        to: recipient,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${recipient}: ${info.response}`);

      // Optional delay to prevent rate limiting
      if (options.delayBetweenEmails) {
        await new Promise((resolve) =>
          setTimeout(resolve, options.delayBetweenEmails)
        );
      }
    } catch (error) {
      console.error(`Failed to send email to ${recipient}:`, error);
    }
  }
};

// // Example usage
// export const emailData: EmailOptions = {
//   from: "awtsguegue12345",
//   recipients: [
//     "gueljohnc@gmail.com",
//   ],
//   subject: "Bulk Email Test",
//   text: "Hello, this is a test bulk email!",
//   delayBetweenEmails: 1000, // 1-second delay to prevent rate limiting
// };

// sendBulkEmails(emailData).catch(console.error);
