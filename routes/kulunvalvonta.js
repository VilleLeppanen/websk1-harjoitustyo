const express = require("express");
const router = express.Router();

const controller = require("../controllers/KulunvalvontaController");

const authorize = require("../verifytoken");

router.delete("/", authorize, controller.deleteHenkilo);

router.get("/", controller.getKulunvalvonta);

router.get("/all", controller.getAll);

router.get("/gethenkilos", controller.getHenkilos);

router.post("/start", authorize, controller.startWork);

router.post("/end", authorize, controller.endWork);

module.exports = router;
