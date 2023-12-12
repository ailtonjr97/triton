const express = require("express");
const Chamados = require("../models/ChamadosModel")
const router = express.Router();

router.get("/get_all/:setor", async(req, res)=>{
    try {
        res.send(await Chamados.all(req.params.setor))
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
});

module.exports = router;