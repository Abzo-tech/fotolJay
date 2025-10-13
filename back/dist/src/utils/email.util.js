"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
        this.transporter = null;
        this.initializeTransporter();
    }
    initializeTransporter() {
        const emailUser = process.env.EMAIL_USER;
        const emailPassword = process.env.EMAIL_PASSWORD;
        // Ne pas initialiser si les credentials ne sont pas configurés
        if (!emailUser || !emailPassword || emailPassword === 'your_app_password') {
            console.warn('⚠️  Email service not configured. Emails will not be sent.');
            return;
        }
        try {
            this.transporter = nodemailer_1.default.createTransport({
                host: process.env.EMAIL_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.EMAIL_PORT || '587'),
                secure: false, // true for 465, false for other ports
                auth: {
                    user: emailUser,
                    pass: emailPassword.replace(/\s/g, ''), // Enlever les espaces
                },
            });
            console.log('✅ Email service initialized');
        }
        catch (error) {
            console.error('❌ Error initializing email service:', error);
        }
    }
    async sendProductSubmittedEmail(data) {
        if (!this.transporter)
            return;
        const mailOptions = {
            from: `"FOTOL JAY" <${process.env.EMAIL_USER}>`,
            to: data.sellerEmail,
            subject: '✅ Votre produit a été soumis avec succès',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Produit soumis avec succès !</h2>
          <p>Bonjour <strong>${data.sellerName}</strong>,</p>
          <p>Votre produit <strong>"${data.productTitle}"</strong> a été soumis avec succès sur FOTOL JAY.</p>
          <p>Il sera examiné par notre équipe de modération et publié sous peu.</p>
          <p>Vous recevrez un email de confirmation dès que votre produit sera approuvé.</p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            Merci d'utiliser FOTOL JAY !<br>
            L'équipe FOTOL JAY
          </p>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`📧 Email sent to ${data.sellerEmail}`);
        }
        catch (error) {
            console.error('Error sending email:', error);
        }
    }
    async sendProductApprovedEmail(data) {
        if (!this.transporter)
            return;
        const mailOptions = {
            from: `"FOTOL JAY" <${process.env.EMAIL_USER}>`,
            to: data.sellerEmail,
            subject: '🎉 Votre produit a été approuvé !',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Produit approuvé !</h2>
          <p>Bonjour <strong>${data.sellerName}</strong>,</p>
          <p>Excellente nouvelle ! Votre produit <strong>"${data.productTitle}"</strong> a été approuvé et est maintenant visible sur FOTOL JAY.</p>
          <p>Les acheteurs potentiels peuvent désormais le voir et vous contacter.</p>
          <p><strong>Rappel :</strong> Votre produit restera en ligne pendant 7 jours. Vous recevrez une notification 24h avant son expiration.</p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            Merci d'utiliser FOTOL JAY !<br>
            L'équipe FOTOL JAY
          </p>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`📧 Approval email sent to ${data.sellerEmail}`);
        }
        catch (error) {
            console.error('Error sending approval email:', error);
        }
    }
    async sendProductRejectedEmail(data) {
        if (!this.transporter)
            return;
        const mailOptions = {
            from: `"FOTOL JAY" <${process.env.EMAIL_USER}>`,
            to: data.sellerEmail,
            subject: '❌ Votre produit a été rejeté',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Produit rejeté</h2>
          <p>Bonjour <strong>${data.sellerName}</strong>,</p>
          <p>Malheureusement, votre produit <strong>"${data.productTitle}"</strong> n'a pas été approuvé.</p>
          ${data.reason ? `<p><strong>Raison :</strong> ${data.reason}</p>` : ''}
          <p>Vous pouvez soumettre un nouveau produit en respectant nos conditions d'utilisation.</p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            L'équipe FOTOL JAY
          </p>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`📧 Rejection email sent to ${data.sellerEmail}`);
        }
        catch (error) {
            console.error('Error sending rejection email:', error);
        }
    }
    async sendProductExpiringEmail(data) {
        if (!this.transporter)
            return;
        const mailOptions = {
            from: `"FOTOL JAY" <${process.env.EMAIL_USER}>`,
            to: data.sellerEmail,
            subject: '⏰ Votre produit expire dans 24h',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f59e0b;">Votre produit expire bientôt</h2>
          <p>Bonjour <strong>${data.sellerName}</strong>,</p>
          <p>Votre produit <strong>"${data.productTitle}"</strong> expirera dans 24 heures.</p>
          <p>Après expiration, il ne sera plus visible sur FOTOL JAY.</p>
          <p>Si vous souhaitez le republier, vous devrez soumettre une nouvelle annonce.</p>
          <hr style="border: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 14px;">
            L'équipe FOTOL JAY
          </p>
        </div>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`📧 Expiring email sent to ${data.sellerEmail}`);
        }
        catch (error) {
            console.error('Error sending expiring email:', error);
        }
    }
}
exports.default = new EmailService();
//# sourceMappingURL=email.util.js.map