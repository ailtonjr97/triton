const express = require("express");
const Chamados = require("../models/ChamadosModel")
const router = express.Router();

router.get("/get_all/:setor/:designado", async(req, res)=>{
    try {
        res.send(await Chamados.all(req.params.setor, req.params.designado))
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
});

router.get("/:id", async(req, res)=>{
    try {
        res.send(await Chamados.one(req.params.id))
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
});

module.exports = router;