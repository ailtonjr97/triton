const axios = require('axios');
const {convertDateFormat} = require('../../utils/protheus')

async function grid(req, res) {
    try {
        const filial   = !req.query.filial   ? ''  : req.query.filial;
        const numero   = !req.query.numero   ? ''  : req.query.numero;
        const cliente  = !req.query.cliente  ? ''  : req.query.cliente;
        const vendedor = !req.query.vendedor ? '' : req.query.vendedor;

        const response = await axios.get(`${process.env.APITOTVS}/MODULO_ORC/grid?filial=${filial}&numero=${numero}&cliente=${cliente}&vendedor=${vendedor}`, {
            auth: {
                username: process.env.USERTOTVS,
                password: process.env.SENHAPITOTVS
            }
        });

        const items = []

        response.data.objects.forEach(e => {
            items.push({
                CJ_FILIAL:  e.CJ_FILIAL,
                CJ_NUM:     e.CJ_NUM,
                CJ_CLIENTE: e.CJ_CLIENTE,
                CJ_LOJA:    e.CJ_LOJA,
                A1_NOME:    e.A1_NOME.trimEnd(),
                A3_NOME:    e.A3_NOME.trimEnd(),
                R_E_C_N_O_: e.R_E_C_N_O_
                
            })
        });

        res.json(items);
    } catch (error) {
        res.sendStatus(error.response.status)
        console.log(error)
    }
}

async function orcamentoInfo(req, res) {
    try {
        const filial  = !req.query.filial  ? '' : req.query.filial;
        const numero  = !req.query.numero  ? '' : req.query.numero;
        const cliente = !req.query.cliente ? '' : req.query.cliente;
        const loja    = !req.query.loja    ? '' : req.query.loja;

        const response = await axios.get(`${process.env.APITOTVS}/MODULO_ORC/unico?filial=${filial}&numero=${numero}&cliente=${cliente}&loja=${loja}`, {
            auth: {
                username: process.env.USERTOTVS,
                password: process.env.SENHAPITOTVS
            }
        });

        const apiObject = response.data.objects[0]

        res.json({
            CJ_FILIAL:  apiObject.CJ_FILIAL,
            CJ_NUM:     apiObject.CJ_NUM,
            CJ_EMISSAO: convertDateFormat(apiObject.CJ_EMISSAO),
            CJ_CLIENTE: apiObject.CJ_CLIENTE,
            CJ_LOJA:    apiObject.CJ_LOJA
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function cliente(req, res) {
    try {
        const cliente  = !req.query.cliente  ? '' : req.query.cliente;
        const loja     = !req.query.loja     ? '' : req.query.loja;

        res.sendStatus(200)
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports = { 
    grid,
    orcamentoInfo,
    cliente
};