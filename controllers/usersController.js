const express = require("express");
const bcrypt = require('bcryptjs');
const Users = require('../models/usersModel')

const router = express.Router();

router.get("/get_all", async(req, res)=>{
    try {
        res.send(await Users.all());
    } catch (error) {
        res.send(error);
    }
});

router.get("/get_all/inactive", async(req, res)=>{
    try {
        res.send(await Users.allInactives());
    } catch (error) {
        res.send(error);
    }
});

router.get("/:id", async(req, res)=>{
    try {
        res.send(await Users.one(req.params.id));
    } catch (error) {
        res.send(error);
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

router.post("/alter/:id", async(req, res)=>{
    try {
        await Users.updateOne(
            req.body.name,
            req.body.email,
            req.body.admin,
            req.body.dpo,
            req.body.setor,
            req.params.id
        )
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }
});

router.post("/reactivate/:id", async(req, res)=>{
    try {
        await Users.reactivateUser(req.params.id)
        res.send(200)
    } catch (error) {
        res.send(500)
    }
});

module.exports = router;