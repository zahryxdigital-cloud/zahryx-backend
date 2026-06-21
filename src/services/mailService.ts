import nodemailer from 'nodemailer';

export class MailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
      pass: process.env.SMTP_PASS || 'etherealpassword',
    },
  });

  static async sendInquiryNotification(inquiry: any) {
    const mailOptions = {
      from: `"Zahryx Digital Alert" <${process.env.SMTP_USER || 'alerts@zahryxdigital.com'}>`,
      to: process.env.ADMIN_ALERT_EMAIL || 'info@zahryxdigital.com',
      subject: `🔥 New Small Business Lead: ${inquiry.name} (${inquiry.businessType || 'No Type'})`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #1e293b; max-width: 600px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #2563eb; margin-top: 0;">New Lead Captured!</h2>
          <p>A local small business owner has requested a quote or consultation from Zahryx Digital.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 150px;">Name:</td>
              <td style="padding: 6px 0;">${inquiry.name}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Email:</td>
              <td style="padding: 6px 0;"><a href="mailto:${inquiry.email}">${inquiry.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Phone:</td>
              <td style="padding: 6px 0;">${inquiry.phone || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Business:</td>
              <td style="padding: 6px 0;">${inquiry.businessName || 'N/A'} (${inquiry.businessType || 'N/A'})</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Service:</td>
              <td style="padding: 6px 0;"><span style="background: #eff6ff; color: #1d4ed8; padding: 2px 8px; border-radius: 4px; font-size: 0.85em;">${inquiry.serviceNeeded}</span></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Budget Range:</td>
              <td style="padding: 6px 0;">${inquiry.budget || 'N/A'}</td>
            </tr>
          </table>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-weight: bold; margin-bottom: 8px;">Message:</p>
          <div style="background: #f8fafc; padding: 12px; border-radius: 6px; font-style: italic; color: #475569;">
            ${inquiry.message.replace(/\n/g, '<br/>')}
          </div>
          <p style="margin-top: 25px; font-size: 0.85em; color: #94a3b8; text-align: center;">
            This lead was safely stored in Zahryx Digital MongoDB instance. Log in to the Admin Dashboard to manage it.
          </p>
        </div>
      `
    };

    try {
      if (!process.env.SMTP_USER) {
        console.log('--- MOCK MAIL SENT ---');
        console.log('To:', mailOptions.to);
        console.log('Subject:', mailOptions.subject);
        console.log('Body Summary:', `Lead ${inquiry.name} - ${inquiry.email}`);
        console.log('----------------------');
        return;
      }
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('SMTP Mail service failed to send, logging to console instead:', error);
    }
  }
}
