const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken')

const users = require("./controllers/usersController.js");
const auth = require("./controllers/authController.js");
const comercial = require("./routes/comercialRoutes.js");
const consulta = require("./routes/consultaRoutes.js");
const logistica = require("./routes/logisticaRoutes.js");
const files = require("./controllers/filesController.js");
const { authenticationMiddleware, authenticationMiddlewareApi } = require('./middlewares/authentication.js');

const app = express();
app.use(cors());

app.use(express.static("public"));
app.use(bodyParser.json());


app.use("/auth", auth);
app.use("/users", authenticationMiddleware, users);
app.use("/consulta", authenticationMiddleware, consulta);
app.use("/comercial", authenticationMiddleware, comercial);
app.use("/logistica", authenticationMiddleware, logistica);
app.use("/files", files);


app.listen(5000, function () {
    console.log("Node.js working in port 5000");
});