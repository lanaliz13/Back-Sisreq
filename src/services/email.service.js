const nodemailer = require("nodemailer");

let transporterPromise = null;

async function getTransporter() {
  if (!transporterPromise) {
    transporterPromise = nodemailer
      .createTestAccount()
      .then((testAccount) => {
        return nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
      });
  }
  return transporterPromise;
}

async function enviarEmail(destinatario, link) {
  console.log("DESTINATARIO:", destinatario);
  console.log("LINK RECEBIDO:", link);

  try {
    console.log("Tentando enviar e-mail...");

    const transporter = await getTransporter();

    const info = await transporter.sendMail({
      from: `"SisReq" <sisreq@teste.com>`,
      to: destinatario,
      subject: "Redefinição de senha - SisReq",

      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2>Recuperação de Senha</h2>

          <p>Você solicitou a redefinição da sua senha.</p>

          <p>Clique no botão abaixo para redefinir sua senha:</p>

          <p>
            
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
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));

    return info;

  } catch (error) {
    console.error("ERRO AO ENVIAR EMAIL:");
    console.error(error);

    throw error;
  }
}

module.exports = enviarEmail;
