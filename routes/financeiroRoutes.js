const express = require('express');
const router = express.Router();
const {
    gridCte,
    refreshCte,
    arquivaCte
} = require('../controllers/financeiro/cteController');

router.get("/grid", gridCte);
router.get("/refresh-cte", refreshCte);
router.put("/arquiva-cte", arquivaCte);

module.exports = router;