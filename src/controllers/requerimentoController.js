const service = require("../services/requerimentoService");

async function criar(req, res) {
  try {
    const requerimento = await service.criar(
      req.body,
      req.files,
      req.usuario.id
    );

    return res.status(201).json({
      mensagem: "Requerimento enviado com sucesso",
      requerimento,
    });
  } catch (error) {
    console.error(error);

    if (error.message === "TIPO_INVALIDO") {
      return res.status(400).json({
        erro: "Tipo de requerimento inválido",
      });
    }

    if (error.message === "CURSO_INVALIDO") {
      return res.status(400).json({
        erro: "Curso inválido",
      });
    }

    if (error.message === "DESCRICAO_INVALIDA") {
      return res.status(400).json({
        erro:
          "Descrição deve possuir pelo menos 10 caracteres",
      });
    }

    return res.status(500).json({
      erro: "Erro interno ao criar requerimento",
    });
  }
}

async function dashboard(req, res) {
  try {
    const resumo = await service.dashboard(
      req.usuario.id
    );

    return res.json(resumo);
  } catch (error) {
    return res.status(500).json({
      erro: "Erro ao carregar dashboard",
    });
  }
}

async function meus(req, res) {
  try {
    const requerimentos = await service.meus(
      req.usuario.id
    );

    return res.json(requerimentos);
  } catch (error) {
    return res.status(500).json({
      erro: "Erro ao buscar requerimentos",
    });
  }
}

async function listar(req, res) {
  try {
    const requerimentos =
      await service.listar(req.query);

    return res.json(requerimentos);
  } catch (error) {
    return res.status(500).json({
      erro: "Erro ao listar requerimentos",
    });
  }
}

async function buscarPorId(req, res) {
  try {

    const requerimento =
      await service.buscarPorId(
        req.params.id,
        req.usuario.id,
        req.usuario.tipo
      );

    if (!requerimento) {
      return res.status(404).json({
        erro: "Requerimento não encontrado",
      });
    }

    return res.json(requerimento);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      erro: "Erro ao buscar requerimento",
    });

  }
}

async function atualizarStatus(req, res) {
  try {
    const atualizado =
      await service.atualizarStatus(
        req.params.id,
        req.body
      );

    return res.json({
      mensagem:
        "Status atualizado com sucesso",
      requerimento: atualizado,
    });
  } catch (error) {
    console.error(error);

    if (
      error.message ===
      "NAO_ENCONTRADO"
    ) {
      return res.status(404).json({
        erro: "Requerimento não encontrado",
      });
    }

    if (
      error.message ===
      "FINALIZADO"
    ) {
      return res.status(400).json({
        erro:
          "Requerimento finalizado não pode ser alterado",
      });
    }

    if (
      error.message ===
      "STATUS_INVALIDO"
    ) {
      return res.status(400).json({
        erro: "Status inválido",
      });
    }

    return res.status(500).json({
      erro: "Erro ao atualizar status",
    });
  }
}

async function cancelar(req, res) {
  try {
    const atualizado =
      await service.cancelar(
        req.params.id,
        req.usuario.id
      );

    return res.json({
      mensagem:
        "Requerimento cancelado com sucesso",
      requerimento: atualizado,
    });
  } catch (error) {
    if (
      error.message ===
      "NAO_ENCONTRADO"
    ) {
      return res.status(404).json({
        erro: "Requerimento não encontrado",
      });
    }

    if (
      error.message ===
      "FINALIZADO"
    ) {
      return res.status(400).json({
        erro:
          "Requerimento finalizado não pode ser cancelado",
      });
    }

    return res.status(500).json({
      erro: "Erro ao cancelar requerimento",
    });
  }
}

module.exports = {
  criar,
  dashboard,
  meus,
  listar,
  buscarPorId,
  atualizarStatus,
  cancelar,
};