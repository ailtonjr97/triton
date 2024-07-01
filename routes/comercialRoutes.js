const express = require('express');
const router = express.Router();
const {grid, orcamentoInfo, cliente, orcamentoItems, condPag, tabPre} = require('../controllers/comercial/orcamentoController');
const {gridPedido, pedidoInfo, pedidoItems} = require('../controllers/comercial/pedidoController');

router.get("/orcamentos", grid);
router.get("/orcamento-info", orcamentoInfo);
router.get("/orcamento-items", orcamentoItems);

router.get("/pedidos", gridPedido);
router.get("/pedido-info", pedidoInfo);
router.get("/pedido-items", pedidoItems);

module.exports = router;