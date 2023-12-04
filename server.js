const express = require("express");
var cors = require('cors');
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken')

const users = require("./controllers/usersController.js");
const qualidade = require("./controllers/qualidadeController.js");
const auth = require("./controllers/authController.js");

var corsOptions = {
origin: [process.env.ORIGIN1, process.env.ORIGIN2, process.env.ORIGIN3],
optionsSuccessStatus: 200
}

const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());

function authenticationMiddleware(req, res, next){
    try {
        const token = req.header('Authorization')
        const withoutBearerToken = token.replace('Bearer ', '');
        if(withoutBearerToken){
            jwt.verify(withoutBearerToken, process.env.JWTSECRET, (err)=>{
              if(err){
                  res.sendStatus(401)
              } else {
                next();
              }
            })
          }else{
              res.sendStatus(401)
          }
    } catch (error) {
        console.log(error)
        res.sendStatus(401)
    }
}

app.use("/auth", cors(corsOptions), auth);
app.use("/users", cors(corsOptions), authenticationMiddleware, users);
app.use("/qualidade", cors(corsOptions), authenticationMiddleware, qualidade);


app.listen(5000, function () {
    console.log("Node.js working in port 5000");
});