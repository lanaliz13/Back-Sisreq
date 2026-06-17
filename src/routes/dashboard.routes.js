const express = require("express");

const controller = require("../controllers/dashboard.controller");

const {
  autenticar,
} = require("../middlewares/auth");

const router = express.Router();

router.get(
  "/",
  autenticar,
  controller.dashboardAluno
);

router.get(
  "/admin",
  autenticar,
  controller.dashboardAdmin
);

router.get(
  "/servidor",
  autenticar,
  controller.dashboardServidor
);

module.exports = router;