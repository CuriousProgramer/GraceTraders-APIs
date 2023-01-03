const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //1 Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    secure: false,
  });
  //2 Define Email Options
  const mailOptions = {
    from: 'Farhan <18251598-146@uog.edu.pk>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //3 Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
