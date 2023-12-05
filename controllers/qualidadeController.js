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

router.get("/inspetores/:setor", async(req, res)=>{
    try {
        res.send(await Qualidade.inspetores(req.params.setor))
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
});

router.post("/documentos/create", async(req, res)=>{
    try {
        await Qualidade.create(req.body);
        res.sendStatus(200);
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

router.post("/documentos/editarEdp/:id", async(req, res)=>{
    try {
        await Qualidade.edpUpdate(req.body, req.params.id)
        res.sendStatus(200);
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

router.post("/documentos/editarPcp/:id", async(req, res)=>{
    try {
        await Qualidade.pcpUpdate(req.body, req.params.id)
        res.sendStatus(200);
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

router.post("/documentos/editarProducao/:id", async(req, res)=>{
    try {
        await Qualidade.producaoUpdate(req.body, req.params.id)
        res.sendStatus(200);
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})



module.exports = router;