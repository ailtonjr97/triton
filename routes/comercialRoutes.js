const express = require('express');
const router = express.Router();
const { 
    grid,
    orcamentoInfo,
    cliente,
    orcamentoItems,
    condPag,
    tabPre
} = require('../controllers/comercial/orcamentoController');

router.get("/orcamentos", grid);
router.get("/orcamento-info", orcamentoInfo);
router.get("/orcamento-items", orcamentoItems);

module.exports = router;