const prisma =
  require("../prisma");

const crypto =
  require("crypto");

const enviarEmail =
  require("./email.service");

async function esqueciSenha(
  email
) {
  const usuario =
    await prisma.usuario.findUnique({
      where: { email },
    });

  if (!usuario) {
    throw new Error(
      "Usuário não encontrado"
    );
  }

  const token =
    crypto
      .randomBytes(32)
      .toString("hex");

  const expira =
    new Date(
      Date.now() + 3600000
    );

  await prisma.usuario.update({
    where: { email },

    data: {
      resetToken: token,
      resetTokenExpira:
        expira,
    },
  });

  const link =
    `${process.env.FRONT_URL}/redefinir-senha/${token}`;

  

  await enviarEmail(
    email,
    link
  );

  return true;
}

module.exports =
  esqueciSenha;