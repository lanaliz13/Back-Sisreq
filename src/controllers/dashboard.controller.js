const prisma = require("../prisma");

async function dashboardAdmin(req, res) {
  try {
    const totalAlunos = await prisma.usuario.count({
      where: {
        tipo: "ALUNO",
      },
    });

    const totalServidores = await prisma.usuario.count({
      where: {
        tipo: "SERVIDOR",
      },
    });

    const totalPendencias = await prisma.requerimento.count({
      where: {
        OR: [
          { status: "ABERTO" },
          { status: "EM_ANALISE" },
        ],
      },
    });

    const pendencias = await prisma.requerimento.findMany({
      where: {
        OR: [
          { status: "ABERTO" },
          { status: "EM_ANALISE" },
        ],
      },

      include: {
        usuario: true,
      },

      orderBy: {
        criadoEm: "asc",
      },

      take: 10,
    });

    const acessos = await prisma.usuario.findMany({
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

module.exports = {
  dashboardAdmin,
};