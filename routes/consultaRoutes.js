const express = require('express');
const router = express.Router();
const { 
    cliente,
    condicaoDePagamento,
    tabelaDePreco,
    vendedor,
    transportadora
} = require('../controllers/consultasController.js');

router.get("/cliente", cliente);
router.get("/vendedor", vendedor);
router.get("/transportadora", transportadora);
router.get("/cond-pag", condicaoDePagamento);
router.get("/tab-preco", tabelaDePreco);

module.exports = router;