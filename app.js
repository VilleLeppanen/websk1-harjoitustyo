const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(cors());

// Angular sovellus buildattu tänne
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.json({ type: "application/x-www-form-urlencoded" }));
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * ROUTES
 */
const users = require("./routes/users");
const kulunvalvonta = require("./routes/kulunvalvonta");
const todo = require("./routes/todo");

app.use("/users", users);
app.use("/kval", kulunvalvonta);
app.use("/todo", todo);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Express serving port ${port}`));
