const prisma = require("../prisma");

async function dashboardAluno(req, res) {
  try {
    const usuarioId = req.usuario.id;

    const abertos = await prisma.requerimento.count({
      where: {
        usuarioId,
        status: "ABERTO",
      },
    });

    const finalizados = await prisma.requerimento.count({
      where: {
        usuarioId,
        status: {
          in: [
            "ENCAMINHADO",
            "NAO_ENCAMINHADO",
            "CANCELADO",
          ],
        },
      },
    });

    const notificacoes =
      await prisma.requerimento.findMany({
        where: {
          usuarioId,
        },

        orderBy: {
          atualizadoEm: "desc",
        },

        take: 10,
      });

    return res.json({
      abertos,
      finalizados,
      notificacoes: notificacoes.map(
        (req) => ({
          id: req.id,
          titulo: `${req.tipo}`,
          descricao: `Status atual: ${req.status}`,
          status: req.status,
          createdAt: req.atualizadoEm,
        })
      ),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro ao carregar dashboard",
    });
  }
}

async function dashboardAdmin(req, res) {
  try {
    const totalAlunos = await prisma.usuario.count({
      where: {
        tipo: "ALUNO",
      },
    });

    const totalServidores =
      await prisma.usuario.count({
        where: {
          tipo: "SERVIDOR",
        },
      });

    const totalPendencias =
      await prisma.requerimento.count({
        where: {
          status: "ABERTO",
        },
      });

    const pendencias =
      await prisma.requerimento.findMany({
        where: {
          status: "ABERTO",
        },

        include: {
          usuario: true,
        },

        orderBy: {
          criadoEm: "asc",
        },

        take: 10,
      });

    const acessos =
      await prisma.usuario.findMany({
        select: {
          id: true,
          nome: true,
          tipo: true,
          ativo: true,
        },

        take: 10,
      });

    return res.json({
      totalAlunos,
      totalServidores,
      totalPendencias,
      pendencias,
      acessos,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro ao carregar dashboard",
    });
  }
}

async function dashboardServidor(req, res) {
  try {
    const totalPendentes =
      await prisma.requerimento.count({
        where: {
          status: "ABERTO",
        },
      });

    const totalFinalizados =
      await prisma.requerimento.count({
        where: {
          status: {
            in: [
              "ENCAMINHADO",
              "NAO_ENCAMINHADO",
              "CANCELADO",
            ],
          },
        },
      });

    const requerimentos =
      await prisma.requerimento.findMany({
        include: {
          usuario: true,
        },

        orderBy: {
          criadoEm: "desc",
        },

        take: 10,
      });

    return res.json({
      totalPendentes,
      totalFinalizados,
      requerimentos,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: "Erro ao carregar dashboard",
    });
  }
}

module.exports = {
  dashboardAdmin,
  dashboardAluno,
  dashboardServidor,
};
