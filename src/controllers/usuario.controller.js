const prisma = require("../prisma");

async function listarUsuarios(req, res) {
  try {
    const { busca } = req.query;

    const usuarios = await prisma.usuario.findMany({
      where: busca
        ? {
            OR: [
              {
                nome: {
                  contains: busca,
                },
              },
              {
                email: {
                  contains: busca,
                },
              },
            ],
          }
        : {},
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        matricula: true,
        ativo: true,
      },
    });

    return res.json(usuarios);
  } catch (error) {
    return res.status(500).json({
      erro: "Erro ao listar usuários",
    });
  }
}

async function atualizarUsuario(req, res) {
  try {
    const { id } = req.params;
    const { tipo } = req.body;

    const usuario = await prisma.usuario.update({
      where: {
        id: Number(id),
      },
      data: {
        tipo,
      },
    });

    return res.json(usuario);
  } catch (error) {
    return res.status(400).json({
      erro: error.message,
    });
  }
}

async function bloquearUsuario(req, res) {
  try {
    const { id } = req.params;

    const usuarioAtual = await prisma.usuario.findUnique({
      where: {
        id: Number(id),
      },
    });

    const usuario = await prisma.usuario.update({
      where: {
        id: Number(id),
      },
      data: {
        ativo: !usuarioAtual.ativo,
      },
    });

    return res.json(usuario);
  } catch (error) {
    return res.status(400).json({
      erro: error.message,
    });
  }
}
  

async function desbloquearUsuario(req, res) {
  try {
    const { id } = req.params;

    const usuario = await prisma.usuario.update({
      where: {
        id: Number(id),
      },
      data: {
        ativo: true,
      },
    });

    return res.json(usuario);
  } catch (error) {
    return res.status(400).json({
      erro: error.message,
    });
  }
}

const cadastrarUsuario = require("../services/cadastro.service");

async function criarUsuario(req, res) {
  try {
    const usuario = await cadastrarUsuario(req.body);

    return res.status(201).json({
      mensagem: "Usuário criado com sucesso",
      usuario,
    });
  } catch (error) {
    return res.status(400).json({
      erro: error.message,
    });
  }
}


module.exports = {
  listarUsuarios,
  atualizarUsuario,
  bloquearUsuario,
  desbloquearUsuario,
  criarUsuario,
};