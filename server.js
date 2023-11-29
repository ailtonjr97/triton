const express = require("express");
var cors = require('cors');
const bodyParser = require("body-parser");

const users = require("./controllers/usersController.js");

var corsOptions = {
origin: 'http://192.168.221.131:8080',
optionsSuccessStatus: 200
}

const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());

app.use("/users", cors(corsOptions), users);

app.listen(5000, function () {
    console.log("Node.js working in port 5000");
});