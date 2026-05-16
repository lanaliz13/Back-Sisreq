const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prisma");

async function loginUsuario(dados) {
  const { email, senha } = dados;

  if (!email || !senha) {
    throw new Error("Informe e-mail e senha");
  }

  const usuario = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!usuario) {
    throw new Error("E-mail ou senha inválidos");
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha);

  if (!senhaValida) {
    throw new Error("E-mail ou senha inválidos");
  }

  const token = jwt.sign(
    {
      id: usuario.id,
      tipo: usuario.tipo,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return {
    mensagem: "Login realizado com sucesso",
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
      matricula: usuario.matricula,
    },
  };
}

module.exports = loginUsuario;