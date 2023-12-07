const express = require("express");
const ApisTotvs = require("../models/apisTotvsModel")
const router = express.Router();

router.get("/apis/lista", async(req, res)=>{
    try {
        res.send(await ApisTotvs.all())
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
});

router.post("/apis/lista", async(req, res)=>{
    try {
        await ApisTotvs.create(req.body);
        res.sendStatus(200);
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
});



module.exports = router;