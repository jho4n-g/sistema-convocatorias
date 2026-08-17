import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const correoService = {
  async enviarCodigoVerificacion({ destinatario, codigo }) {
    await transporter.sendMail({
      from: `"Sistema de Contrataciones" <${process.env.MAIL_FROM}>`,
      to: destinatario,
      subject: 'Código de verificación',

      text: `Tu código de verificación es: ${codigo}. Expira en 15 minutos.`,

      html: `
        <div style="font-family: Arial, sans-serif">
          <h2>Verificación de correo</h2>

          <p>Utiliza el siguiente código para activar tu cuenta:</p>

          <div
            style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
              margin: 24px 0;
            "
          >
            ${codigo}
          </div>

          <p>El código expira en 15 minutos.</p>

          <p>
            Si no realizaste este registro, puedes ignorar este mensaje.
          </p>
        </div>
      `,
    });
  },
};
