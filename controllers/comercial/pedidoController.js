const axios = require('axios');
const {convertDateFormat, formatarParaMoedaBrasileira, convertDateForInput} = require('../../utils/protheus')

async function gridPedido(req, res) {
    const { filial = '', numero = ''} = req.query;

    try {
        const response = await axios.get(`${process.env.APITOTVS}/MODULO_PEDIDO/grid`, {
            params: {filial, numero},
            auth: {
                username: process.env.USERTOTVS,
                password: process.env.SENHAPITOTVS
            }
        });

        const items = response.data.objects.map(e => ({
            C5_FILIAL:  e.C5_FILIAL,
            C5_NUM:     e.C5_NUM,
            R_E_C_N_O_: e.R_E_C_N_O_
        }));

        res.json(items);
    } catch (error) {
        console.error('Erro ao obter dados da grid:', error.message);
        res.sendStatus(error.response?.status || 500);
    }
};

async function pedidoInfo(req, res) {
    try {
        const { filial = '', numero = ''} = req.query;

        const response = await axios.get(`${process.env.APITOTVS}/MODULO_PEDIDO/unico`, {
            params: {filial, numero},
            auth: {
                username: process.env.USERTOTVS,
                password: process.env.SENHAPITOTVS
            }
        });

        const apiObject = response.data.objects[0]

        res.json({
            C5_FILIAL:  apiObject.C5_FILIAL,
            C5_NUM:     apiObject.C5_NUM,
            C5_XPEDTR:  apiObject.C5_XPEDTR,
            C5_XNUMORC: apiObject.C5_XNUMORC,
            C5_CLIENTE: apiObject.C5_CLIENTE,
            C5_LOJAENT: apiObject.C5_LOJAENT,
            C5_EMISSAO: apiObject.C5_EMISSAO,
            C5_FECENT:  apiObject.C5_FECENT,
            C5_XPRCATU: apiObject.C5_XPRCATU,
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function pedidoItems(req, res) {
    try {
        const { filial = '', numero = '' } = req.query;

        const response = await axios.get(`${process.env.APITOTVS}/MODULO_PEDIDO/items`, {
            params: { numero, filial },
            auth: {
                username: process.env.USERTOTVS,
                password: process.env.SENHAPITOTVS
            }
        });

        const items = response.data.objects.map(element => ({
            C6_FILIAL:  element.C6_FILIAL,
            C6_ITEM:    element.C6_ITEM,
            C6_PRODUTO: element.C6_PRODUTO.trimEnd(),
            C6_DESCRI:  element.C6_DESCRI.trimEnd(),
        }));

        res.json(items);

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

module.exports = { 
    gridPedido,
    pedidoInfo,
    pedidoItems
};