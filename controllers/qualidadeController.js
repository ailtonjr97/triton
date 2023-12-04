const express = require("express");
const Qualidade = require("../models/QualidadeModel")
const router = express.Router();

router.get("/documentos/get_all", async(req, res)=>{
    try {
        res.send(await Qualidade.all())
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
});

router.get("/documentos/:id", async(req, res)=>{
    try {
        res.send(await Qualidade.one(req.params.id))
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
});

module.exports = router;