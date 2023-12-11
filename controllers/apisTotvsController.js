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
        res.send(await ApisTotvs.get('acy'))
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

router.post("/api/acy/update", async(req, res)=>{
    try {
        const values = [];
        const limitador = await axios.get(process.env.APITOTVS + "CONSULTA_ACY/get_all", {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
        const response = await axios.get(process.env.APITOTVS + "CONSULTA_ACY/get_all?limit=" + limitador.data.meta.total, {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
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

router.get("/api/d12/get_all", async(req, res)=>{
    try {
        res.send(await ApisTotvs.get("d12"))
    } catch (error) {
        console.log(error)
        res.sendStatus(500) 
    }
})

router.post("/api/d12/update", async(req, res)=>{
    try {
        const values = [];
        const limitador = await axios.get(process.env.APITOTVS + "CONSULTA_D12/get_all", {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
        const response = await axios.get(process.env.APITOTVS + "CONSULTA_D12/get_all?limit=" + limitador.data.meta.total, {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
        response.data.objects.forEach(response => {
            values.push([
                response.filial,
                response.produt,
                response.lotect,
                response.doc,
                response.serie,
                response.clifor,
                response.loja,
                response.status,
                response.servic,
                response.qtdori,
                response.qtdlid,
                response.endori,
                response.locdes,
                response.enddes,
                response.rechum,
            ]) 
        });
        await ApisTotvs.updateD12(values);
        res.sendStatus(200);
    } catch (error) {
        console.log(error)
        res.sendStatus(500)  
    }
})

router.get("/api/d14/get_all", async(req, res)=>{
    try {
        res.send(await ApisTotvs.get("d14"))
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

router.post("/api/d14/update", async(req, res)=>{
    try {
        const values = [];
        const limitador = await axios.get(process.env.APITOTVS + "CONSULTA_D14/get_all", {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
        const response = await axios.get(process.env.APITOTVS + "CONSULTA_D14/get_all?limit=" + limitador.data.meta.total, {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
        response.data.objects.forEach(response => {
            values.push([
                response.filial,
                response.local,
                response.ender,
                response.produt,
                response.lotect,
                response.dtvald,
                response.dtfabr,
                response.estfis,
                response.qtdest,
                response.qtdepr,
                response.qtdspr,
                response.qtdblq,
                response.idunit
            ]) 
        });
        await ApisTotvs.updateD14(values);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

router.get("/api/dcf/get_all", async(req, res)=>{
    try {
        res.send(await ApisTotvs.get("dcf"));
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

router.post("/api/dcf/update", async(req, res)=>{
    try {
        const values = [];
        const limitador = await axios.get(process.env.APITOTVS + "CONSULTA_DCF/get_all", {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
        const response = await axios.get(process.env.APITOTVS + "CONSULTA_DCF/get_all?limit=" + limitador.data.meta.total, {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
        response.data.objects.forEach(response => {
            values.push([
                response.filial,
                response.lotect,
                response.servic,
                response.docto,
                response.serie,
                response.codpro,
                response.clifor,
                response.loja,
                response.quant,
                response.qtdori,
                response.local,
                response.ender,
                response.locdes,
                response.enddes,
                response.stserver
            ])
        });
        await ApisTotvs.updateDcf(values);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

router.get("/api/se4/get_all", async(req, res)=>{
    try {
        res.send(await ApisTotvs.get("se4"));
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

router.post("/api/se4/update", async(req, res)=>{
    try {
        const values = [];
        const limitador = await axios.get(process.env.APITOTVS + "CONSULTA_SE4/get_all", {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
        const response = await axios.get(process.env.APITOTVS + "CONSULTA_SE4/get_all?limit=" + limitador.data.meta.total, {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
        response.data.objects.forEach(response => {
            values.push([
                response.filial,
                response.codigo,
                response.tipo,
                response.cond,
                response.descri
            ])
        });
        await ApisTotvs.updateSe4(values);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})



module.exports = router;