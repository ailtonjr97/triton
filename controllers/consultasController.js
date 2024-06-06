const axios = require('axios');

async function cliente(req, res) {
    try {
        let filial     = !req.query.filial   ? '' : req.query.filial;
        const cliente  = !req.query.cliente  ? '' : req.query.cliente;
        const loja     = !req.query.loja     ? '' : req.query.loja;

        filial = filial.substring(0, 4) //Tabela clientes só tem 4 digitos na coluna A1_FILIAL

        const response = await axios.get(`${process.env.APITOTVS}/PADRAO_SA1/cliente?filial=${filial}&cliente=${cliente}&loja=${loja}`, {
            auth: {
                username: process.env.USERTOTVS,
                password: process.env.SENHAPITOTVS
            }
        });
        
        const item = response.data.objects[0]

        res.json({
            0:  item.A1_COD,
            1:  item.A1_LOJA,
            2:  item.A1_NOME.trimEnd(),
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

async function condicaoDePagamento(req, res) {
    try {
        const cod = !req.query.cod  ? '' : req.query.cod;

        const response = await axios.get(`${process.env.APITOTVS}/PADRAO_SE4/one?numero=${cod}`, {
            auth: {
                username: process.env.USERTOTVS,
                password: process.env.SENHAPITOTVS
            }
        });
        
        const item = response.data.objects[0]

        res.json({
            0:  item.E4_TIPO,
            1:  item.E4_DESCRI,
            2:  item.E4_CODIGO,
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(error.response?.status || 500);
    }
}

async function tabelaDePreco(req, res) {
    try {
        const cod    = !req.query.cod     ? '' : req.query.cod;
        const filial = !req.query.filial  ? '' : req.query.filial;

        const response = await axios.get(`${process.env.APITOTVS}/MODULO_ORC/tabpre?numero=${cod}&filial=${filial}`, {
            auth: {
                username: process.env.USERTOTVS,
                password: process.env.SENHAPITOTVS
            }
        });
        
        const item = response.data.objects[0]

        res.json({
            0:  item.DA0_CODTAB,
            1:  item.DA0_DESCRI,
        })
    } catch (error) {
        console.log(error);
        res.sendStatus(error.response?.status || 500);
    }
}

module.exports = { 
    cliente,
    condicaoDePagamento,
    tabelaDePreco
};