const express = require("express");
const korpModel = require("../models/korpModel")
const router = express.Router();

router.get("/produtos/get_all", async(req, res)=>{
    try {
        res.json(await korpModel.all())
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
});

router.get("/produtos/pesquisa", async(req, res)=>{
    try {
        let resultados
        if(req.query.resultados == 'null' || req.query.resultados == undefined || req.query.resultados == '')
        {
            resultados = 1000
        }else{
            resultados = req.query.resultados
        }
        res.json(await korpModel.search(req.query.codigo, resultados, req.query.nome));
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/produto/:codigo", async(req, res)=>{
    try {
        res.json(await korpModel.product(req.params.codigo));
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/pedidos-de-compra/get_all", async(req, res)=>{
    try {
        res.json(await korpModel.allPedidosDeCompra())
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
});

router.get("/pedidos-de-compra/pesquisa", async(req, res)=>{
    try {
        let resultados
        if(req.query.resultados == 'null' || req.query.resultados == undefined || req.query.resultados == '')
        {
            resultados = 1000
        }else{
            resultados = req.query.resultados
        }
        res.json(await korpModel.searchPedidosDeCompra(req.query.codigo, resultados, req.query.rassoc));
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/pedido-de-compra/:codigo", async(req, res)=>{
    try {
        res.json(await korpModel.pedidoDeCompra(req.params.codigo));
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/pedido-de-compra/obs1/:codigo", async(req, res)=>{
    try {
        res.json(await korpModel.uncryptObs(req.params.codigo));
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = router;