const express = require("express");
const ApisTotvs = require("../models/apisTotvsModel")
const router = express.Router();
const axios = require('axios');

router.get("/api/lista", async(req, res)=>{
    try {
        res.send(await ApisTotvs.all())
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
});

router.post("/api/lista", async(req, res)=>{
    try {
        await ApisTotvs.create(req.body);
        res.sendStatus(200);
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
});

router.get("/api/acy/get_all", async(req, res)=>{
    try {
        res.send(await ApisTotvs.getAcy())
    } catch (error) {
        console.log(error)
        res.sendStatus(500) 
    }
})

router.get("/api/acy/update", async(req, res)=>{
    try {
        const values = [];
        const limitador = await axios.get(process.env.APITOTVS + "CONSULTA_ACY/get_all", {auth: {username: process.env.USER, password: process.env.SENHAPITOTVS}});
        const response = await axios.get(process.env.APITOTVS + "CONSULTA_ACY/get_all?limit=" + limitador.data.meta.total, {auth: {username: process.env.USER, password: process.env.SENHAPITOTVS}});
        response.data.objects.forEach(response => {
            values.push([response.grpven, response.descri]) 
        });
        await ApisTotvs.updateAcy(values);
        res.sendStatus(200);
    } catch (error) {
        console.log(error)
        res.sendStatus(500)  
    }
})



module.exports = router;