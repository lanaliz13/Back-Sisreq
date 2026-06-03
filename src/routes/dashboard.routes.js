const express = require("express");
const controller = require("../controllers/dashboard.controller");

const router = express.Router();

router.get("/admin", controller.dashboardAdmin);

module.exports = router;