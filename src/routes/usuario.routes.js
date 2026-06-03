const express = require("express");
const controller = require("../controllers/usuario.controller");

const router = express.Router();

router.get("/", controller.listarUsuarios);

router.put("/:id", controller.atualizarUsuario);

router.put("/:id/bloquear", controller.bloquearUsuario);

router.put("/:id/desbloquear", controller.desbloquearUsuario);

module.exports = router;