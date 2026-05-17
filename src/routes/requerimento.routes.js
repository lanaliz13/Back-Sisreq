const express = require("express");
const multer = require("multer");
const fs = require("fs-extra");

const prisma = require("../prisma");
const { autenticar, autorizar } = require("../middlewares/auth");

const router = express.Router();

fs.ensureDirSync("src/uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads");
  },

  filename: (req, file, cb) => {
    const nomeArquivo = Date.now() + "-" + file.originalname;
    cb(null, nomeArquivo);
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    const tiposPermitidos = [
      "application/pdf",
      "image/png",
      "image/jpeg",
    ];

    if (tiposPermitidos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Arquivo inválido"));
    }
  },
});

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
      const {
        tipo,
        descricao,
        semestreAtual,
        cursoAtual,
      } = req.body;

      if (!tipo || !descricao || !semestreAtual || !cursoAtual) {
        return res.status(400).json({
          erro:
            "Todos os campos obrigatórios devem ser preenchidos",
        });
      }

      if (!tiposPermitidos.includes(tipo)) {
        return res.status(400).json({
          erro: "Tipo de requerimento inválido",
        });
      }

      if (!cursosPermitidos.includes(cursoAtual)) {
        return res.status(400).json({
          erro: "Curso inválido",
        });
      }

      if (descricao.length < 10) {
        return res.status(400).json({
          erro:
            "A descrição deve possuir pelo menos 10 caracteres",
        });
      }

      const requerimento = await prisma.requerimento.create({
        data: {
          protocolo: gerarProtocolo(),

          tipo,
          descricao,
          semestreAtual,
          cursoAtual,

          prioridade: definirPrioridade(tipo),

          usuarioId: req.usuario.id,

          anexos: {
            create:
              req.files?.map((file) => ({
                nomeArquivo: file.originalname,
                caminho: file.filename,
              })) || [],
          },
        },

        include: {
          anexos: true,
        },
      });

      return res.status(201).json({
        mensagem:
          "Requerimento enviado com sucesso",
        requerimento,
      });
    } catch (error) {
      console.error(error);

      if (error.message === "Arquivo inválido") {
        return res.status(400).json({
          erro:
            "Formato de arquivo não permitido. Envie apenas PDF, PNG ou JPG",
        });
      }

      if (error.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          erro:
            "O arquivo excede o limite máximo de 5MB",
        });
      }

      return res.status(500).json({
        erro:
          "Erro interno ao criar requerimento",
      });
    }
  }
);

const tiposPermitidos = [
  "Atestado",
  "Trancamento de Disciplina",
  "Aproveitamento",
  "Segunda Chamada",
  "Outro",
];

const cursosPermitidos = [
  "Bacharelado em Sistemas de Informação",
  "Engenharia elétrica",
  "Engenharia Mecânica",
  "Licenciatura em Física",
  "Licenciatura em Matemática",
  "Tecnólogo em Mecatrônica Industrial",
];

function definirPrioridade(tipo) {
  const prioridades = {
    Atestado: "BAIXA",
    Aproveitamento: "MEDIA",
    "Segunda Chamada": "MEDIA",
    "Trancamento de Disciplina": "ALTA",
    Outro: "MEDIA",
  };

  return prioridades[tipo] || "MEDIA";
}

router.get(
  "/dashboard/resumo",
  autenticar,
  autorizar("ALUNO"),
  async (req, res) => {
    try {
      const usuarioId = req.usuario.id;

      const abertos = await prisma.requerimento.count({
        where: {
          usuarioId,
          status: "ABERTO",
        },
      });

      const emAnalise = await prisma.requerimento.count({
        where: {
          usuarioId,
          status: "EM_ANALISE",
        },
      });

      const finalizados = await prisma.requerimento.count({
        where: {
          usuarioId,
          status: {
            in: [
              "DEFERIDO",
              "INDEFERIDO",
              "CANCELADO",
            ],
          },
        },
      });

      return res.json({
        abertos,
        emAnalise,
        finalizados,
      });
    } catch (error) {
      return res.status(500).json({
        erro: "Erro ao carregar dashboard",
      });
    }
  }
);

router.get(
  "/meus",
  autenticar,
  autorizar("ALUNO"),
  async (req, res) => {
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
      res.status(500).json({
        erro: "Erro ao buscar requerimentos",
      });
    }
  }
);

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
      res.status(500).json({
        erro: "Erro ao listar requerimentos",
      });
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
        where: {
          id: Number(id),
        },
      });

      if (!requerimento) {
        return res.status(404).json({
          erro: "Requerimento não encontrado",
        });
      }

      if (
        ["DEFERIDO", "INDEFERIDO", "CANCELADO"].includes(
          requerimento.status
        )
      ) {
        return res.status(400).json({
          erro: "Requerimento finalizado não pode ser alterado",
        });
      }

      const atualizado = await prisma.requerimento.update({
        where: {
          id: Number(id),
        },

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
      res.status(500).json({
        erro: "Erro ao atualizar status",
      });
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
        return res.status(404).json({
          erro: "Requerimento não encontrado",
        });
      }

      if (
        ["DEFERIDO", "INDEFERIDO", "CANCELADO"].includes(
          requerimento.status
        )
      ) {
        return res.status(400).json({
          erro: "Requerimento finalizado não pode ser cancelado",
        });
      }

      const atualizado = await prisma.requerimento.update({
        where: {
          id: Number(id),
        },

        data: {
          status: "CANCELADO",
        },
      });

      res.json({
        mensagem: "Requerimento cancelado com sucesso",
        requerimento: atualizado,
      });
    } catch (error) {
      res.status(500).json({
        erro: "Erro ao cancelar requerimento",
      });
    }
  }
);

module.exports = router;