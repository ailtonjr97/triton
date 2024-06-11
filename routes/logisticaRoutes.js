const express = require('express');
const router = express.Router();
const { 
    refreshCte,
} = require('../controllers/logistica/cteController');

router.get("/refresh-cte", refreshCte);

module.exports = router;