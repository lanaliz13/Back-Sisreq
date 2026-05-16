const cadastrarUsuario = require("../services/cadastro.service");
const loginUsuario = require("../services/login.service");

async function cadastrar(req, res) {
  try {
    const usuario = await cadastrarUsuario(req.body);

    return res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso",
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
    const resultado = await loginUsuario(req.body);

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(401).json({
      erro: error.message,
    });
  }
}

module.exports = {
  cadastrar,
  login,
};