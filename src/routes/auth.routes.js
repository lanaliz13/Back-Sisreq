const express = require("express");
const authController = require("../controllers/auth.controller");
const { autenticar } = require("../middlewares/auth");

const router = express.Router();

router.post("/cadastro", authController.cadastrar);

router.post("/login", authController.login);

router.get("/me", autenticar, authController.me);

// esqueci senha
router.post(
  "/esqueci-senha",
  authController.esqueciSenha
);

// redefinir senha
router.post(
  "/redefinir-senha/:token",
  authController.redefinirSenha
);

module.exports = router;