const express = require("express");
var cors = require('cors');
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken')

const users = require("./controllers/usersController.js");
const qualidade = require("./controllers/qualidadeController.js");
const auth = require("./controllers/authController.js");
const comercial = require("./routes/comercialRoutes.js");
const files = require("./controllers/filesController.js");
const { authenticationMiddleware, authenticationMiddlewareApi } = require('./middlewares/authentication.js');

var corsOptions = {
origin: [process.env.ORIGIN1, process.env.ORIGIN2, process.env.ORIGIN3],
optionsSuccessStatus: 200
}

const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());


app.use("/auth", cors(corsOptions), auth);
app.use("/users", cors(corsOptions), authenticationMiddleware, users);
app.use("/comercial", cors(corsOptions), authenticationMiddleware, comercial);
app.use("/files", cors(corsOptions), files);



app.listen(5000, function () {
    console.log("Node.js working in port 5000");
});