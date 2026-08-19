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

// ======================
// SERVIDOR / ADMIN
// ======================

router.get(
  "/",
  autenticar,
  autorizar("SERVIDOR", "ADMIN"),
  controller.listar
);

// AGORA ALUNO TAMBÉM PODE CONSULTAR
router.get(
  "/:id",
  autenticar,
  autorizar(
    "ALUNO",
    "SERVIDOR",
    "ADMIN"
  ),
  controller.buscarPorId
);

router.patch(
  "/:id/status",
  autenticar,
  autorizar(
    "SERVIDOR",
    "ADMIN"
  ),
  controller.atualizarStatus
);

module.exports = router;