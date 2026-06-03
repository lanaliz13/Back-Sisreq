const express = require("express");

const upload = require("../middlewares/upload");

const {
  autenticar,
  autorizar,
} = require("../middlewares/auth");

const controller = require(
  "../controllers/requerimentoController"
);

const router = express.Router();

// ======================
// ALUNO
// ======================

router.post(
  "/",
  autenticar,
  autorizar("ALUNO"),
  upload.array("anexos"),
  controller.criar
);

router.get(
  "/dashboard/resumo",
  autenticar,
  autorizar("ALUNO"),
  controller.dashboard
);

router.get(
  "/meus",
  autenticar,
  autorizar("ALUNO"),
  controller.meus
);

router.patch(
  "/:id/cancelar",
  autenticar,
  autorizar("ALUNO"),
  controller.cancelar
);

// ======================
// SERVIDOR
// ======================

router.get(
  "/",
  autenticar,
  autorizar("SERVIDOR"),
  controller.listar
);

router.get(
  "/:id",
  autenticar,
  autorizar("SERVIDOR"),
  controller.buscarPorId
);

router.patch(
  "/:id/status",
  autenticar,
  autorizar("SERVIDOR"),
  controller.atualizarStatus
);

module.exports = router;