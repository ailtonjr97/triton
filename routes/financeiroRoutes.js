const express = require('express');
const router = express.Router();
const {
    gridCte,
    refreshCte,
    arquivaCte,
    pdfNf,
    roboBusca
} = require('../controllers/financeiro/cteController');

router.get("/grid", gridCte);
router.get("/pdf-nf", pdfNf);
router.get("/robo-busca", roboBusca);
router.get("/refresh-cte", refreshCte);
router.put("/arquiva-cte", arquivaCte);

module.exports = router;