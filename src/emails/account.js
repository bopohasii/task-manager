const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendWelcomeEmail(email, name) {
  sgMail.send({
    to: email,
    from: 'bogdanpogasiy@gmail.com',
    subject: 'Sending with Twilio SendGrid is Fun',
    text: `Welcome ${name} from Node.js`,
  });
}

function sendCancellationEmail(email, name) {
  sgMail.send({
    to: email,
    from: 'bogdanpogasiy@gmail.com',
    subject: 'Sorry to see you go',
    text: `${name} Hope to see you again`,
  });
}

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
};
