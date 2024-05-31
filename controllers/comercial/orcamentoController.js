const orcamentoModel = require('../../models/comercial/orcamentoModel');
const axios = require('axios');

async function grid(req, res) {
    try {
        const filial = !req.query.filial ? '' : req.query.filial;
        const numero = !req.query.numero ? '' : req.query.numero;

        const response = await axios.get(`${process.env.APITOTVS}MODULO_ORC/grid?filial=${filial}&numero=${numero}`, {
            auth: {
                username: process.env.USERTOTVS,
                password: process.env.SENHAPITOTVS
            }
        });

        res.json(response.data.objects);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function orcamentoInfo(req, res) {
    try {
        const filial  = !req.query.filial  ? '' : req.query.filial;
        const numero  = !req.query.numero  ? '' : req.query.numero;
        const cliente = !req.query.cliente ? '' : req.query.cliente;
        const loja    = !req.query.loja    ? '' : req.query.loja;

        const response = await axios.get(`${process.env.APITOTVS}MODULO_ORC/unico?filial=${filial}&numero=${numero}&cliente=${cliente}&loja=${loja}`, {
            auth: {
                username: process.env.USERTOTVS,
                password: process.env.SENHAPITOTVS
            }
        });

        res.json(response.data.objects[0]);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports = { 
    grid,
    orcamentoInfo
};