const express = require("express");
const comercialModel = require("../models/comercialModel");
const ApisTotvs = require("../models/apisTotvsModel");
const router = express.Router();
const XLSX = require('xlsx')
const path = require('path')
const fs = require('fs')
const PDFKit = require('pdfkit');
const axios = require('axios');

router.get("/proposta-de-frete", async(req, res)=>{
    try {
        res.json(await comercialModel.all());
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/proposta-de-frete/pesquisa", async(req, res)=>{
    try {
        let resultados
        if(req.query.resultados == 'null' || req.query.resultados == undefined || req.query.resultados == '')
        {
            resultados = 1000
        }else{
            resultados = req.query.resultados
        }
        res.json(await comercialModel.search(req.query.pedido, resultados));
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/proposta-de-frete/:id", async(req, res)=>{
    try {
        res.json(await comercialModel.proposta(req.params.id));
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.post("/proposta-de-frete/:id", async(req, res)=>{
    try {
        await comercialModel.freteUpdate(req.body, req.params.id);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/sck/:numped", async(req, res)=>{
    try {
        const values = [];
        const limitador = await axios.get(process.env.APITOTVS + "CONSULTA_SCK/get_all", {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
        const response = await axios.get(process.env.APITOTVS + "CONSULTA_SCK/get_all?limit=" + limitador.data.meta.total, {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
        response.data.objects.forEach(response => {
            values.push(response); 
        });
        res.send(response.data);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = router;