const prisma = require("../prisma");
const gerarProtocolo = require("../utils/protocolo");
const definirPrioridade = require("../utils/prioridade");

const {
  tiposPermitidos,
  cursosPermitidos,
} = require("../utils/constantesRequerimento");

// ======================
// CONSTANTES
// ======================
const STATUS_FINALIZADOS = ["DEFERIDO", "INDEFERIDO", "CANCELADO"];
const STATUS_PERMITIDOS = [
  "ABERTO",
  "EM_ANALISE",
  "AGUARDANDO_AJUSTE",
  "DEFERIDO",
  "INDEFERIDO",
  "CANCELADO",
];
// ======================
// CRIAR REQUERIMENTO
// ======================
async function criar(body, files, usuarioId) {
  const { tipo, descricao, semestreAtual, cursoAtual } = body;

  if (!tiposPermitidos.includes(tipo)) {
    throw new Error("TIPO_INVALIDO");
  }

  if (!cursosPermitidos.includes(cursoAtual)) {
    throw new Error("CURSO_INVALIDO");
  }

  if (!descricao || descricao.length < 10) {
    throw new Error("DESCRICAO_INVALIDA");
  }

  return prisma.requerimento.create({
    data: {
      protocolo: gerarProtocolo(),

      tipo,
      descricao,
      semestreAtual,
      cursoAtual,

      prioridade: definirPrioridade(tipo),
      usuarioId,

      anexos: {
        create:
          files?.map((file) => ({
            nomeArquivo: file.originalname,
            caminho: file.filename,
          })) || [],
      },
    },

    include: {
      anexos: true,
    },
  });
}

// ======================
// DASHBOARD
// ======================
async function dashboard(usuarioId) {
  const [abertos, emAnalise, finalizados] = await Promise.all([
    prisma.requerimento.count({
      where: { usuarioId, status: "ABERTO" },
    }),

    prisma.requerimento.count({
      where: { usuarioId, status: "EM_ANALISE" },
    }),

    prisma.requerimento.count({
      where: { usuarioId, status: { in: STATUS_FINALIZADOS } },
    }),
  ]);

  return {
    abertos,
    emAnalise,
    finalizados,
  };
}

// ======================
// REQUERIMENTOS DO ALUNO
// ======================
async function meus(usuarioId) {
  return prisma.requerimento.findMany({
    where: { usuarioId },

    include: {
      anexos: true,
    },

    orderBy: {
      criadoEm: "desc",
    },
  });
}

// ======================
// LISTAR (ADMIN / SERVIDOR)
// ======================
async function listar(filtros) {
  const { status, tipo, busca } = filtros;

  const where = {};

  if (status) where.status = status;
  if (tipo) where.tipo = tipo;

  if (busca) {
    where.OR = [
      {
        protocolo: {
          contains: busca,
          mode: "insensitive",
        },
      },
      {
        usuario: {
          nome: {
            contains: busca,
            mode: "insensitive",
          },
        },
      },
      {
        cursoAtual: {
          contains: busca,
          mode: "insensitive",
        },
      },
    ];
  }

  return prisma.requerimento.findMany({
    where,

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
}

// ======================
// BUSCAR POR ID
// ======================
async function buscarPorId(id) {
  return prisma.requerimento.findUnique({
    where: { id: Number(id) },

    include: {
      usuario: true,
      anexos: true,
    },
  });
}

// ======================
// ATUALIZAR STATUS
// ======================
async function atualizarStatus(id, dados) {
  const requerimento =
    await prisma.requerimento.findUnique({
      where: {
        id: Number(id),
      },
    });

  if (!requerimento) {
    throw new Error("NAO_ENCONTRADO");
  }

  if (
    STATUS_FINALIZADOS.includes(
      requerimento.status
    )
  ) {
    throw new Error("FINALIZADO");
  }

  if (
    !STATUS_PERMITIDOS.includes(
      dados.status
    )
  ) {
    throw new Error(
      "STATUS_INVALIDO"
    );
  }

  return prisma.requerimento.update({
    where: {
      id: Number(id),
    },

    data: {
      status: dados.status,
      justificativaServidor:
        dados.justificativaServidor ||
        null,
    },
  });
}

// ======================
// CANCELAR
// ======================
async function cancelar(id, usuarioId) {
  const requerimento = await prisma.requerimento.findFirst({
    where: {
      id: Number(id),
      usuarioId,
    },
  });

  if (!requerimento) {
    throw new Error("NAO_ENCONTRADO");
  }

  if (STATUS_FINALIZADOS.includes(requerimento.status)) {
    throw new Error("FINALIZADO");
  }

  return prisma.requerimento.update({
    where: { id: Number(id) },

    data: {
      status: "CANCELADO",
    },
  });
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