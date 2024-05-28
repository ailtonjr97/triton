const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken')

const users = require("./controllers/usersController.js");
const qualidade = require("./controllers/qualidadeController.js");
const auth = require("./controllers/authController.js");
const comercial = require("./routes/comercialRoutes.js");
const files = require("./controllers/filesController.js");
const { authenticationMiddleware, authenticationMiddlewareApi } = require('./middlewares/authentication.js');

const app = express();
app.use(cors());

app.use(express.static("public"));
app.use(bodyParser.json());


app.use("/auth", auth);
app.use("/users", authenticationMiddleware, users);
app.use("/comercial", authenticationMiddleware, comercial);
app.use("/files", files);



app.listen(5000, function () {
    console.log("Node.js working in port 5000");
});