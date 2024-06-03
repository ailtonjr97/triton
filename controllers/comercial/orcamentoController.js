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
            CJ_LOJA:    apiObject.CJ_LOJA,
            CJ_CLIENT:  apiObject.CJ_CLIENT,
            CJ_LOJAENT: apiObject.CJ_LOJAENT,
            CJ_CONDPAG: apiObject.CJ_CONDPAG,
            CJ_TABELA:  apiObject.CJ_TABELA
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function cliente(req, res) {
    try {
        let filial   = !req.query.filial   ? '' : req.query.filial;
        const cliente  = !req.query.cliente  ? '' : req.query.cliente;
        const loja     = !req.query.loja     ? '' : req.query.loja;

        filial = filial.substring(0, 4) //Tabela clientes só tem 4 digitos na coluna A1_FILIAL

        const response = await axios.get(`${process.env.APITOTVS}/MODULO_ORC/cliente?filial=${filial}&cliente=${cliente}&loja=${loja}`, {
            auth: {
                username: process.env.USERTOTVS,
                password: process.env.SENHAPITOTVS
            }
        });
        
        const item = response.data.objects[0]

        res.json({
            A1_COD:  item.A1_COD,
            A1_NOME: item.A1_NOME.trimEnd(),
            A1_CGC:  item.A1_CGC,
            A1_END:  item.A1_END.trimEnd(),
            A1_MUN:  item.A1_MUN.trimEnd(),
            A1_EST:  item.A1_EST,
            A1_CEP:  item.A1_CEP,
        })
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