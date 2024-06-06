const axios = require('axios');
const {convertDateFormat, formatarParaMoedaBrasileira} = require('../../utils/protheus')

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
            CJ_TABELA:  apiObject.CJ_TABELA,
            CJ_TPFRETE: apiObject.CJ_TPFRETE,
            CJ_XREDESP: apiObject.CJ_XREDESP,
            CJ_XVEND1:  apiObject.CJ_XVEND1,
            CJ_TIPLIB:  apiObject.CJ_TIPLIB,
            CJ_XESTADO: apiObject.CJ_XESTADO,
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function orcamentoItems(req, res) {
    try {
        const filial  = !req.query.filial  ? '' : req.query.filial;
        const numero  = !req.query.numero  ? '' : req.query.numero;

        const response = await axios.get(`${process.env.APITOTVS}/MODULO_ORC/items?numero=${numero}&filial=${filial}`, {
            auth: {
                username: process.env.USERTOTVS,
                password: process.env.SENHAPITOTVS
            }
        });

        const items = [];

        response.data.objects.forEach(element => {
            items.push({
                CJ_FILIAL:  element.CJ_FILIAL,
                CK_ITEM:    element.CK_ITEM,
                CK_PRODUTO: element.CK_PRODUTO.trimEnd(),
                CK_UM:      element.CK_UM,
                CK_QTDVEN:  element.CK_QTDVEN,
                CK_PRCVEN:  formatarParaMoedaBrasileira(element.CK_PRCVEN),
                CK_VALOR:   formatarParaMoedaBrasileira(element.CK_VALOR),
                CK_DESCRI:  element.CK_DESCRI,
                CK_NUM:     element.CK_NUM,
            })
        });

        res.json(items);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports = { 
    grid,
    orcamentoInfo,
    orcamentoItems,
};