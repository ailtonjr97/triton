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
        const response = await axios.get(process.env.APITOTVS + "CONSULTA_SCK_2/get_all_id?idN=" + req.params.numped, {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
        res.send(response.data)
    } catch (error) {
        res.sendStatus(500);
    }
});

router.post("/nova-proposta-de-frete/:numped/:cotador", async(req, res)=>{
    try {
        let today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        today = dd + '/' + mm + '/' + yyyy;

        let revisao = await comercialModel.revisaoCotacao(req.params.numped);

        //Necessário criar 3 cotações
        if(revisao.length == 0){
            await comercialModel.novaProposta(req.params.numped, req.params.cotador, today, 1);
            await comercialModel.novaProposta(req.params.numped, req.params.cotador, today, 1);
            await comercialModel.novaProposta(req.params.numped, req.params.cotador, today, 1);
            for(let i = 0; i < req.body.length; i++){
                await comercialModel.novosItens(req.params.numped, req.body[i]);
            };
        }else{
            await comercialModel.novaProposta(req.params.numped, req.params.cotador, today, parseInt(revisao[0].revisao) + 1);
            await comercialModel.novaProposta(req.params.numped, req.params.cotador, today, parseInt(revisao[0].revisao) + 1);
            await comercialModel.novaProposta(req.params.numped, req.params.cotador, today, parseInt(revisao[0].revisao) + 1);
        };

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/proposta-frete-itens/:numped", async(req, res)=>{
    try {
        res.json(await comercialModel.freteItens(req.params.numped));
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/transportadoras", async(req, res)=>{
    try {
        const response = await axios.get(process.env.APITOTVS + "CONSULTA_SA4/get_all", {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
        res.send(response.data.objects)
    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }
});

module.exports = router;