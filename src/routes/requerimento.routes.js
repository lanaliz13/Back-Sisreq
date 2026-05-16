const express = require("express");
const multer = require("multer");
const prisma = require("../prisma");
const { autenticar, autorizar } = require("../middlewares/auth");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },
  filename: (req, file, cb) => {
    const nomeArquivo = Date.now() + "-" + file.originalname;
    cb(null, nomeArquivo);
  },
});

const upload = multer({ storage });

function gerarProtocolo() {
  return "REQ-" + Date.now();
}

router.post(
  "/",
  autenticar,
  autorizar("ALUNO"),
  upload.array("anexos"),
  async (req, res) => {
    try {
      const { tipo, descricao } = req.body;

      const requerimento = await prisma.requerimento.create({
        data: {
          protocolo: gerarProtocolo(),
          tipo,
          descricao,
          usuarioId: req.usuario.id,
          anexos: {
            create: req.files.map((file) => ({
              nomeArquivo: file.originalname,
              caminho: file.filename,
            })),
          },
        },
        include: {
          anexos: true,
        },
      });

      res.status(201).json({
        mensagem: "Requerimento criado com sucesso",
        requerimento,
      });
    } catch (error) {
      res.status(500).json({ erro: "Erro ao criar requerimento" });
    }
  }
);

router.get("/meus", autenticar, autorizar("ALUNO"), async (req, res) => {
  try {
    const requerimentos = await prisma.requerimento.findMany({
      where: {
        usuarioId: req.usuario.id,
      },
      include: {
        anexos: true,
      },
      orderBy: {
        criadoEm: "desc",
      },
    });

    res.json(requerimentos);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar requerimentos" });
  }
});

router.get(
  "/",
  autenticar,
  autorizar("SERVIDOR", "ADMIN"),
  async (req, res) => {
    try {
      const { status, tipo } = req.query;

      const requerimentos = await prisma.requerimento.findMany({
        where: {
          status: status || undefined,
          tipo: tipo || undefined,
        },
        include: {
          usuario: {
            select: {
              id: true,
              nome: true,
              email: true,
              matricula: true,
            },
          },
          anexos: true,
        },
        orderBy: {
          criadoEm: "desc",
        },
      });

      res.json(requerimentos);
    } catch (error) {
      res.status(500).json({ erro: "Erro ao listar requerimentos" });
    }
  }
);

router.patch(
  "/:id/status",
  autenticar,
  autorizar("SERVIDOR", "ADMIN"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status, justificativaServidor } = req.body;
      

      const requerimento = await prisma.requerimento.findUnique({
        where: { id: Number(id) },
      });

      if (!requerimento) {
        return res.status(404).json({ erro: "Requerimento não encontrado" });
      }

      if (
        ["DEFERIDO", "INDEFERIDO", "CANCELADO"].includes(requerimento.status)
      ) {
        return res.status(400).json({
          erro: "Requerimento finalizado não pode ser alterado",
        });
      }

      const atualizado = await prisma.requerimento.update({
        where: { id: Number(id) },
        data: {
          status,
          justificativaServidor,
        },
      });

      res.json({
        mensagem: "Status atualizado com sucesso",
        requerimento: atualizado,
      });
    } catch (error) {
      res.status(500).json({ erro: "Erro ao atualizar status" });
    }
  }
);

router.patch(
  "/:id/cancelar",
  autenticar,
  autorizar("ALUNO"),
  async (req, res) => {
    try {
      const { id } = req.params;

      const requerimento = await prisma.requerimento.findFirst({
        where: {
          id: Number(id),
          usuarioId: req.usuario.id,
        },
      });

      if (!requerimento) {
        return res.status(404).json({ erro: "Requerimento não encontrado" });
      }

      if (
        ["DEFERIDO", "INDEFERIDO", "CANCELADO"].includes(requerimento.status)
      ) {
        return res.status(400).json({
          erro: "Requerimento finalizado não pode ser cancelado",
        });
      }

      const atualizado = await prisma.requerimento.update({
        where: { id: Number(id) },
        data: {
          status: "CANCELADO",
        },
      });

      res.json({
        mensagem: "Requerimento cancelado com sucesso",
        requerimento: atualizado,
      });
    } catch (error) {
      res.status(500).json({ erro: "Erro ao cancelar requerimento" });
    }
  }
);

module.exports = router;