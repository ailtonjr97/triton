const express = require('express');
const router = express.Router();
const { 
    grid,
    orcamentoInfo,
    cliente
} = require('../controllers/comercial/orcamentoController');

router.get("/orcamentos", grid);
router.get("/orcamento-info", orcamentoInfo);
router.get("/cliente-info", cliente);

module.exports = router;