const jwt = require("jsonwebtoken");

function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: "Token não informado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = dados;
    next();
  } catch (error) {
    return res.status(401).json({ erro: "Token inválido" });
  }
}

function autorizar(...tiposPermitidos) {
  return (req, res, next) => {
    if (!tiposPermitidos.includes(req.usuario.tipo)) {
      return res.status(403).json({ erro: "Acesso negado" });
    }

    next();
  };
}

module.exports = {
  autenticar,
  autorizar,
};