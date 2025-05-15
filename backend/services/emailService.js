const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "smartcarpool1@gmail.com",
    pass: "apfs ytux zfci wmvi", // app password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/**
 * Send email notification to multiple recipients
 * @param {Array<string>} recipients - list of emails
 * @param {string} subject - email subject
 * @param {string} htmlMessage - email HTML content
 */
async function sendNotificationEmail(recipients, subject, htmlMessage) {
  if (!recipients || recipients.length === 0) {
    throw new Error("No recipients provided");
  }
  const mailOptions = {
    from: "smartcarpool1@gmail.com",
    to: recipients,
    subject,
    html: htmlMessage,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = {
  sendNotificationEmail,
};
