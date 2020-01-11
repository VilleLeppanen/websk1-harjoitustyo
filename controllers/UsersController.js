const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config");
const secret = config.secret;
const db = require("../db");

const UserController = {
  // uuden käyttäjän rekisteröinti
  registerUser: function(req, res, next) {
    console.log(req.body);

    // kryptataan salasana
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    const query = `
            INSERT INTO 
            user (username, password, isadmin) 
            VALUES ('${req.body.username}', '${hashedPassword}', ${req.body.isadmin});`;

    console.log(query);

    db.query(query, (err, results, fields) => {
      if (err) {
        return res.status(500).send("Käyttäjän rekisteröinti epäonnistui.");
      }
      // tehdään token käyttäjälle
      const payload = {
        username: results.username,
        isadmin: results.isadmin
      };
      const token = jwt.sign(payload, secret, {
        expiresIn: 60 * 60 * 24 //vanhenee 24h
      });

      // token paulautetaan
      res.json({
        success: true,
        token: token
      });
    });
  },

  // olemassa olevan käyttäjän autentikaatio
  authenticateUser: function(req, res, next) {
    const query = `SELECT * FROM user WHERE username = '${req.body.username}';`;
    console.log(query);

    db.query(query, (error, result, fields) => {
      if (error) console.log("error: " + error);

      // console.log(result);
      let user = JSON.parse(JSON.stringify(result))[0];
      console.log(user);

      if (user === undefined)
        return res
          .status(200)
          .send({ token: null, message: "User not found." });

      // vertaa salasanaa kannassa kryptattuna olevaan
      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res
          .status(200)
          .send({ token: null, message: "Wrong password." });
      }

      // tehdään token käyttäjälle
      let token = jwt.sign(
        { username: user.username, isadmin: user.isadmin },
        secret,
        { expiresIn: 60 * 60 * 24 } //vanhenee 24h
      );

      // token paulautetaan
      res.status(200).send({ token: token, message: "Log in ok." });
    });
  }
};

module.exports = UserController;
