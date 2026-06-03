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

module.exports = definirPrioridade;