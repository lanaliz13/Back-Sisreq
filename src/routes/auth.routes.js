const express = require("express");
const authController = require("../controllers/auth.controller");
const { autenticar } = require("../middlewares/auth");

const router = express.Router();

router.post("/cadastro", authController.cadastrar);

router.post("/login", authController.login);

// usuário logado
router.get("/me", autenticar, authController.me);

module.exports = router;