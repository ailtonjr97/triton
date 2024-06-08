const axios = require('axios');
const {convertDateFormat, formatarParaMoedaBrasileira, convertDateForInput} = require('../../utils/protheus')

async function grid(req, res) {
    const { filial = '', numero = '', cliente = '', vendedor = '' } = req.query;

    try {
        const response = await axios.get(`${process.env.APITOTVS}/MODULO_ORC/grid`, {
            params: { filial, numero, cliente, vendedor },
            auth: {
                username: process.env.USERTOTVS,
                password: process.env.SENHAPITOTVS
            }
        });

        const items = response.data.objects.map(e => ({
            CJ_FILIAL:  e.CJ_FILIAL,
            CJ_NUM:     e.CJ_NUM,
            CJ_CLIENTE: e.CJ_CLIENTE,
            CJ_LOJA:    e.CJ_LOJA,
            A1_NOME:    e.A1_NOME.trimEnd(),
            A3_NOME:    e.A3_NOME.trimEnd(),
            R_E_C_N_O_: e.R_E_C_N_O_
        }));

        res.json(items);
    } catch (error) {
        console.error('Erro ao obter dados da grid:', error.message);
        res.sendStatus(error.response?.status || 500);
    }
}

async function orcamentoInfo(req, res) {
    try {
        const { filial = '', numero = '', cliente = '', loja = '' } = req.query;

        const response = await axios.get(`${process.env.APITOTVS}/MODULO_ORC/unico`, {
            params: { filial, numero, cliente, loja },
            auth: {
                username: process.env.USERTOTVS,
                password: process.env.SENHAPITOTVS
            }
        });

        const apiObject = response.data.objects[0]

        res.json({
            CJ_FILIAL:  apiObject.CJ_FILIAL,
            CJ_NUM:     apiObject.CJ_NUM,
            CJ_EMISSAO: convertDateForInput(apiObject.CJ_EMISSAO),
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
            CJ_XPVKORP: apiObject.CJ_XPVKORP,
            CJ_TIPOCLI: apiObject.CJ_TIPOCLI,
            CJ_XDESTAB: apiObject.CJ_XDESTAB,
            A3_NOME:    apiObject.A3_NOME,
            CJ_XFREIMP: formatarParaMoedaBrasileira(apiObject.CJ_XFREIMP),
            CJ_VALIDA:  convertDateForInput(apiObject.CJ_VALIDA),
            CJ_XOBS:    apiObject.CJ_XOBS,
            CJ_DATA1:   convertDateForInput(apiObject.CJ_DATA1),
            CJ_XENTREG: convertDateForInput(apiObject.CJ_XENTREG),
            CJ_CST_FTS: apiObject.CJ_CST_FTS,
            CJ_XFREMA:  formatarParaMoedaBrasileira(apiObject.CJ_XFREMA),
            CJ_XTRANSP: apiObject.CJ_XTRANSP,
            CJ_XFRESIM: formatarParaMoedaBrasileira(apiObject.CJ_XFRESIM),
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function orcamentoItems(req, res) {
    try {
        const { filial = '', numero = '' } = req.query;

        const response = await axios.get(`${process.env.APITOTVS}/MODULO_ORC/items`, {
            params: { numero, filial },
            auth: {
                username: process.env.USERTOTVS,
                password: process.env.SENHAPITOTVS
            }
        });

        const items = response.data.objects.map(element => ({
            CJ_FILIAL:  element.CJ_FILIAL,
            CK_ITEM:    element.CK_ITEM,
            CK_PRODUTO: element.CK_PRODUTO.trimEnd(),
            CK_UM:      element.CK_UM,
            CK_QTDVEN:  element.CK_QTDVEN,
            CK_PRCVEN:  formatarParaMoedaBrasileira(element.CK_PRCVEN),
            CK_VALOR:   formatarParaMoedaBrasileira(element.CK_VALOR),
            CK_DESCRI:  element.CK_DESCRI,
            CK_NUM:     element.CK_NUM,
        }));

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