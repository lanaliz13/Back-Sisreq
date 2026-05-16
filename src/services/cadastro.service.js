const bcrypt = require("bcryptjs");
const prisma = require("../prisma");
const validarSenhaForte = require("../utils/validarSenha");

async function cadastrarUsuario(dados) {
  const { nome, email, senha, tipo, matricula } = dados;

  if (!nome || !email || !senha || !tipo) {
    throw new Error("Preencha todos os campos obrigatórios");
  }

  if (!validarSenhaForte(senha)) {
    throw new Error(
      "A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial."
    );
  }

  const usuarioExiste = await prisma.usuario.findUnique({
    where: { email },
  });

  if (usuarioExiste) {
    throw new Error("E-mail já cadastrado");
  }

  const senhaCriptografada = await bcrypt.hash(senha, 10);

  const usuario = await prisma.usuario.create({
    data: {
      nome,
      email,
      senha: senhaCriptografada,
      tipo,
      matricula,
    },
  });

  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    tipo: usuario.tipo,
    matricula: usuario.matricula,
  };
}

module.exports = cadastrarUsuario;