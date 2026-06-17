const nodemailer = require("nodemailer");

const transporter =
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

async function enviarEmail(
  destinatario,
  link
) {
  console.log("DESTINATARIO:", destinatario);
  console.log("LINK RECEBIDO:", link);

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject:
      "Redefinição de senha - SisReq",

    html: `
      <h2>Recuperação de Senha</h2>
      <p>Clique no link abaixo:</p>

      <a href="${link}">
        Redefinir senha
      </a>

      <p>Esse link expira em 1 hora.</p>
    `,
  });

  console.log("EMAIL ENVIADO");
}

module.exports = enviarEmail;