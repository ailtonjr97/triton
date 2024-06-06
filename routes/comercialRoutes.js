const express = require('express');
const router = express.Router();
const { 
    grid,
    orcamentoInfo,
    cliente,
    orcamentoItems,
    condPag
} = require('../controllers/comercial/orcamentoController');

router.get("/orcamentos", grid);
router.get("/orcamento-info", orcamentoInfo);
router.get("/orcamento-items", orcamentoItems);
router.get("/cond-pag", condPag);
router.get("/cliente-info", cliente);

module.exports = router;