const express = require("express");
const router = express.Router();

const controller = require("../controllers/TodoController");

const authorize = require("../verifytoken");

router.get("/", controller.getTodo); // todo haku

router.post("/", authorize, controller.addTodo); // uuden todo luonti

router.delete("/", authorize, controller.deleteTodo); // todo poisto

module.exports = router;
