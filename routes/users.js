const express = require("express");
const router = express.Router();

const controller = require('../controllers/UsersController');

router.post('/register', controller.registerUser); // uuden käyttäjän luonti

router.post('/login', controller.authenticateUser); // login

module.exports = router;
