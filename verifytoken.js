const jwt = require("jsonwebtoken");
const config = require("./config");
const secret = config.secret;

function verifyToken(req, res, next) {
  // otetaan vastaan token kahdella eri tavalla
  const token = req.body.token || req.headers["x-access-token"];

  // jos ei tule tokenia
  if (!token) {
    console.log("No token provided.");
    return res.status(401).send({ auth: false, message: "No token provided." });
  }
  // puretaan token
  if (token) {
    // console.log("Token: " + token);
    jwt.verify(token, secret, function(err, decoded) {
      if (err) {
        return res
          .status(500)
          .send({ auth: false, message: "Failed to authenticate token." });
      }
      // console.log(decoded);
      next(); // seuraava metodi
    });
  }
}

module.exports = verifyToken;
