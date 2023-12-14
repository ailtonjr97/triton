const express = require("express");
const Chamados = require("../models/ChamadosModel")
const router = express.Router();

router.get("/get_all/:setor/:designado", async(req, res)=>{
    try {
        res.json(await Chamados.all(req.params.setor, req.params.designado))
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
});

router.get("/get_one/:id", async(req, res)=>{
    try {
        res.json(await Chamados.one(req.params.id))
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
});

router.post("/update/:id", async(req, res)=>{
    try {
        await Chamados.update(req.body, req.params.id)
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
});

router.get("/requisitante", async(req, res)=>{
    try {
        res.send(await Chamados.requisitante())
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
});

router.get("/designado/:id", async(req, res)=>{
    try {
        res.json(await Chamados.designado(req.params.id))
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
});

module.exports = router;