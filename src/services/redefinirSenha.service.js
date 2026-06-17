const prisma = require("../prisma");
const bcrypt = require("bcryptjs");

async function redefinirSenha(
  token,
  novaSenha
) {
  const usuario =
    await prisma.usuario.findFirst({
      where: {
        resetToken: token,
      },
    });

  if (!usuario) {
    throw new Error(
      "Token inválido"
    );
  }

  if (
    usuario.resetTokenExpira <
    new Date()
  ) {
    throw new Error(
      "Token expirado"
    );
  }

  const senhaHash =
    await bcrypt.hash(novaSenha, 10);

  await prisma.usuario.update({
    where: {
      id: usuario.id,
    },

    data: {
      senha: senhaHash,
      resetToken: null,
      resetTokenExpira: null,
    },
  });

  return true;
}

module.exports =
  redefinirSenha;