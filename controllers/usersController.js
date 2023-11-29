const express = require("express");
const bcrypt = require('bcryptjs');
const Users = require('../models/usersModel')

const router = express.Router();

router.get("/get_all", async(req, res)=>{
    try {
        res.send(await Users.all())
    } catch (error) {
        res.send(error)
    }
});

router.get("/get_all/inactive", async(req, res)=>{
    try {
        res.send(await Users.allInactives())
    } catch (error) {
        res.send(error)
    }
});

router.post("/register", async(req, res)=>{
    try {
        const existingUser = await Users.userRegisterConfirmation(req.body.email);
        if(existingUser.length != 0){
            res.status(401).send("User already exists");
        }else{
            const hashedPassword = bcrypt.hashSync(req.body.password)
            await Users.register(
                req.body.name,
                req.body.email,
                hashedPassword,
                req.body.admin,
                req.body.setor
            )
            res.sendStatus(200);
        }
    } catch (error) {
        res.sendStatus(500);
    }
});

router.post("/reactivate", async(req, res)=>{
    try {
        Users.reactivateUser()
        res.send(200)
    } catch (error) {
        res.send(500)
    }
});

module.exports = router;