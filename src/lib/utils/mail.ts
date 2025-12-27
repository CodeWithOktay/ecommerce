import nodemailer from "nodemailer";

// Ortam değişkeninden domaini al
const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/new-password?token=${token}`;

  const logoUrl = domain.includes("localhost")
    ? "https://cdn-icons-png.flaticon.com/512/3081/3081329.png"
    : `${domain}/kervanpazar-logo.png`;

  const htmlTemplate = `
  <div style="background-color:#f4f6f8;padding:40px 0;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;">
      
      <!-- Header -->
      <div style="padding:30px;text-align:center;border-bottom:1px solid #f0f0f0;">
        <img src="${logoUrl}" alt="KervanPazar" style="width:72px;margin-bottom:12px;" />
        <h1 style="margin:0;font-size:22px;color:#111827;">KervanPazar</h1>
        <p style="margin-top:6px;font-size:13px;color:#6b7280;">
          Alışverişin Güvenli Limanı
        </p>
      </div>

      <!-- Content -->
      <div style="padding:32px;">
        <p style="font-size:15px;color:#111827;line-height:1.6;margin-bottom:16px;">
          Merhaba,
        </p>

        <p style="font-size:15px;color:#111827;line-height:1.6;margin-bottom:20px;">
          KervanPazar hesabın için bir <strong>şifre sıfırlama talebi</strong> aldık.
          Bu isteği sen yaptıysan aşağıdaki butonu kullanarak yeni şifreni belirleyebilirsin.
        </p>

        <p style="font-size:14px;color:#374151;line-height:1.6;margin-bottom:30px;">
          Eğer bu isteği sen yapmadıysan, bu e-postayı görmezden
          alabilirsin. Hesabın güvende kalacaktır.
        </p>

        <!-- Button -->
        <div style="text-align:center;margin:32px 0;">
          <a href="${resetLink}"
            style="background-color:#2563eb;color:#ffffff;text-decoration:none;
            padding:14px 30px;border-radius:6px;font-size:15px;
            font-weight:600;display:inline-block;">
            Şifremi Sıfırla
          </a>
        </div>

        <!-- Fallback link -->
        <div style="border-top:1px solid #e5e7eb;padding-top:20px;">
          <p style="font-size:13px;color:#6b7280;line-height:1.5;">
            Buton çalışmıyorsa, aşağıdaki bağlantıyı tarayıcına yapıştırabilirsin:
          </p>
          <p style="font-size:13px;word-break:break-all;">
            <a href="${resetLink}" style="color:#2563eb;text-decoration:none;">
              ${resetLink}
            </a>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div style="background-color:#f9fafb;padding:20px;text-align:center;font-size:12px;color:#9ca3af;">
        <p style="margin:4px 0;">© ${new Date().getFullYear()} KervanPazar</p>
        <p style="margin:4px 0;">Bu e-posta otomatik olarak gönderilmiştir.</p>
      </div>

    </div>
  </div>
  `;

  await transporter.sendMail({
    from: '"KervanPazar Güvenlik" <' + process.env.SMTP_EMAIL + ">",
    to: email,
    subject: "Şifre Sıfırlama Talebi | KervanPazar",
    html: htmlTemplate,
  });
};

// lib/mail.ts dosyasının en altına ekle:

export const sendContactEmail = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  const { name, email, subject, message } = data;

  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-bottom: 1px solid #e0e0e0;">
        <h2 style="color: #1f2937; margin: 0;">📩 Yeni İletişim Mesajı</h2>
        <p style="color: #6b7280; font-size: 14px; margin-top: 5px;">Sitenizden yeni bir ziyaretçi size ulaştı.</p>
      </div>
      
      <div style="padding: 20px; background-color: #ffffff;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #374151; width: 120px;">Gönderen:</td>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; color: #111827;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #374151;">E-posta:</td>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; color: #111827;">
              <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; font-weight: bold; color: #374151;">Konu:</td>
            <td style="padding: 10px; border-bottom: 1px solid #f0f0f0; color: #111827;">${subject}</td>
          </tr>
        </table>

        <div style="margin-top: 20px;">
          <p style="font-weight: bold; color: #374151; margin-bottom: 10px;">Mesaj İçeriği:</p>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; color: #4b5563; line-height: 1.6; border: 1px solid #e5e7eb;">
            ${message}
          </div>
        </div>
      </div>

      <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #9ca3af;">
        Bu e-posta KervanPazar iletişim formundan gönderilmiştir.
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"İletişim Formu" <${process.env.SMTP_EMAIL}>`, // Sistemden geliyor
    to: process.env.SMTP_EMAIL, // KENDİNE (ADMİNE) GÖNDERİYORSUN
    replyTo: email, // "Yanıtla" dediğinde kullanıcının maili seçilsin
    subject: `💬 İletişim: ${subject} - ${name}`,
    html: htmlTemplate,
  });
};
