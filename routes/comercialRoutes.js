const express = require('express');
const router = express.Router();
const { 
    grid,
    orcamentoInfo
} = require('../controllers/comercial/orcamentoController');

router.get("/orcamentos", grid);
router.get("/orcamento-info", orcamentoInfo);

module.exports = router;