const express = require("express");
const Rh = require("../models/rhModel")
const router = express.Router();

router.get("/documentos/get_all", async(req, res)=>{
    try {
        res.json(await Rh.all())
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
});

router.post("/documentos/create", async(req, res)=>{
    try {
        await Rh.create(req.body);
        res.sendStatus(200);
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

module.exports = router;