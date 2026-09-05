const nodemailer = require('nodemailer')

class MailService {

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      family: 4,  // форсувати IPv4, уникнути ENETUNREACH на IPv6
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }

  async sendActivationMail(to_email, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: to_email,
      subject: `Activation account on ${process.env.API_URL}`,
      text: '',
      html:
      `
      <div>
      <h1>For activate account go to link</h1>
      <a href="${link}">${link}</a>
      </div>
      `
    })
  }
}

module.exports = new MailService()
