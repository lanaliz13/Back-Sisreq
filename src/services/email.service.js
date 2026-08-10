const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

async function enviarEmail(destinatario, link) {
  console.log("DESTINATARIO:", destinatario);
  console.log("LINK RECEBIDO:", link);

  try {
    console.log("Tentando enviar e-mail...");

    const info = await transporter.sendMail({
      from: `"SisReq" <${process.env.EMAIL_USER}>`,
      to: destinatario,
      subject: "Redefinição de senha - SisReq",

      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2>Recuperação de Senha</h2>

          <p>Você solicitou a redefinição da sua senha.</p>

          <p>Clique no botão abaixo para redefinir sua senha:</p>

          <p>
            <a
              href="${link}"
              style="
                display: inline-block;
                padding: 12px 20px;
                background-color: #087f3e;
                color: white;
                text-decoration: none;
                border-radius: 6px;
              "
            >
              Redefinir minha senha
            </a>
          </p>

          <p>Se o botão não funcionar, copie este link:</p>

          <p>${link}</p>

          <p>Esse link expira em 1 hora.</p>
        </div>
      `,
    });

    console.log("EMAIL ENVIADO!");
    console.log("Message ID:", info.messageId);

    return info;

  } catch (error) {
    console.error("ERRO AO ENVIAR EMAIL:");
    console.error(error);

    throw error;
  }
}

module.exports = enviarEmail;