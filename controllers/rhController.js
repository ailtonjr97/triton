const express = require("express");
const Rh = require("../models/rhModel")
const router = express.Router();
const multer = require('multer');
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './storage')
    },
    filename: function (req, file, cb) {
        const nome = file.originalname.replace(/\.[^/.]+$/, "")
        cb(null, nome + "-" + req.params.id + path.extname(file.originalname)) //Appending extension
    }
  })

const upload = multer({ storage: storage })

router.post("/documentos/anexos/:id", upload.single('file'), async(req, res)=>{
    try {
        await Rh.novoAnexo(req.file, req.params.id)
        res.sendStatus(200);
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

router.get("/documentos/anexos-lista/:id", async(req, res)=>{
    try {
        res.json(await Rh.listaAnexos(req.params.id))
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

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