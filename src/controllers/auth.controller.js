const cadastrarUsuario =
  require("../services/cadastro.service");

const loginUsuario =
  require("../services/login.service");

const esqueciSenhaService =
  require("../services/esqueciSenha.service");

const redefinirSenhaService =
  require("../services/redefinirSenha.service");

const prisma =
  require("../prisma");

async function cadastrar(req, res) {
  try {
    const usuario =
      await cadastrarUsuario(req.body);

    return res.status(201).json({
      mensagem:
        "Usuário cadastrado com sucesso",
      usuario,
    });

  } catch (error) {
    return res.status(400).json({
      erro: error.message,
    });
  }
}

async function login(req, res) {
  try {
    const resultado =
      await loginUsuario(req.body);

    return res.status(200).json(
      resultado
    );

  } catch (error) {
    return res.status(401).json({
      erro: error.message,
    });
  }
}

async function me(req, res) {
  try {
    const usuario =
      await prisma.usuario.findUnique({
        where: {
          id: req.usuario.id,
        },

        select: {
          id: true,
          nome: true,
          email: true,
          matricula: true,
          tipo: true,
        },
      });

    return res.json(usuario);

  } catch (error) {
    return res.status(500).json({
      erro:
        "Erro ao buscar usuário",
    });
  }
}

async function esqueciSenha(
  req,
  res
) {
  try {
    const { email } =
      req.body;

    await esqueciSenhaService(
      email
    );

    return res.json({
      mensagem:
        "Email enviado com sucesso",
    });

  } catch (error) {
    return res.status(400).json({
      erro:
        error.message,
    });
  }
}
async function redefinirSenha(
  req,
  res
) {
  try {
    const { token } = req.params;

    const { senha } = req.body;

    await redefinirSenhaService(
      token,
      senha
    );

    return res.json({
      mensagem:
        "Senha alterada com sucesso",
    });

  } catch (error) {
    return res.status(400).json({
      erro: error.message,
    });
  }
}

module.exports = {
  cadastrar,
  login,
  me,
  esqueciSenha,
  redefinirSenha,
};