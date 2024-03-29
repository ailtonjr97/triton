const express = require("express");
const comercialModel = require("../models/comercialModel");
const router = express.Router();
const XLSX = require('xlsx')
const path = require('path')
const fs = require('fs')
const PDFKit = require('pdfkit');
const axios = require('axios');

router.get("/proposta-de-frete", async(req, res)=>{
    try {
        res.json(await comercialModel.all());
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/proposta-de-frete-semrev", async(req, res)=>{
    try {
        res.json(await comercialModel.allSemRevisao());
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/proposta-de-frete/pesquisa", async(req, res)=>{
    try {
        let resultados
        if(req.query.resultados == 'null' || req.query.resultados == undefined || req.query.resultados == '')
        {
            resultados = 1000
        }else{
            resultados = req.query.resultados
        }
        res.json(await comercialModel.search(req.query.pedido, resultados));
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/proposta-de-frete-semrev/pesquisa", async(req, res)=>{
    try {
        let resultados
        if(req.query.resultados == 'null' || req.query.resultados == undefined || req.query.resultados == '')
        {
            resultados = 1000
        }else{
            resultados = req.query.resultados
        }
        res.json(await comercialModel.searchSemRevisao(req.query.pedido, resultados));
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/proposta-de-frete/excel", async(req, res)=>{
    try {
        let resultados
        if(req.query.resultados == 'null' || req.query.resultados == undefined || req.query.resultados == '')
        {
            resultados = 1000
        }else{
            resultados = req.query.resultados
        }
        const response = await comercialModel.search(req.query.pedido, resultados);
        const workSheet = XLSX.utils.json_to_sheet(response);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "cotacoes");
        const aleat = Math.round(Math.random() * 1000)
        XLSX.writeFile(workBook, `./temp/cotacoes${aleat}.xlsx`);
        res.sendFile(path.join(__dirname, '..', 'temp', `cotacoes${aleat}.xlsx`))
        setTimeout(()=>{
            fs.unlinkSync(`./temp/cotacoes${aleat}.xlsx`);
        }, 8000)
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/proposta-de-frete-semrev/excel", async(req, res)=>{
    try {
        let resultados
        if(req.query.resultados == 'null' || req.query.resultados == undefined || req.query.resultados == '')
        {
            resultados = 1000
        }else{
            resultados = req.query.resultados
        }
        const response = await comercialModel.searchSemRevisao(req.query.pedido, resultados);
        const workSheet = XLSX.utils.json_to_sheet(response);
        const workBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workBook, workSheet, "cotacoes");
        const aleat = Math.round(Math.random() * 1000)
        XLSX.writeFile(workBook, `./temp/cotacoes${aleat}.xlsx`);
        res.sendFile(path.join(__dirname, '..', 'temp', `cotacoes${aleat}.xlsx`))
        setTimeout(()=>{
            fs.unlinkSync(`./temp/cotacoes${aleat}.xlsx`);
        }, 8000)
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/proposta-de-frete/pdf", async(req, res)=>{
    try {
        let resultados
        if(req.query.resultados == 'null' || req.query.resultados == undefined || req.query.resultados == '')
        {
            resultados = 1000
        }else{
            resultados = req.query.resultados
        }
        const pdf = new PDFKit();
        const aleat = Math.round(Math.random() * 1000);
        const response = await comercialModel.search(req.query.pedido, resultados);
        pdf.text("Cotacoes: ")
        response.forEach(element => {
            pdf.text('ID: ' + element.id).fontSize(10);
            pdf.text('Pedido: ' + element.pedido).fontSize(10);
            pdf.text('Vendedor: ' + element.vendedor).fontSize(10);
            pdf.text('Status: ' + element.status).fontSize(10);
            pdf.text('Data Solicitação: ' + element.data_solicit).fontSize(10);
            pdf.text('Data Resposta: ' + element.data_resp).fontSize(10);
            pdf.text('Revisão: ' + element.revisao).fontSize(10);
            pdf.text('Valor: ' + element.valor).fontSize(10);
            pdf.text('Transportadora: ' + element.nome_transportadora).fontSize(10);
            pdf.text('Prazo: ' + element.prazo).fontSize(10);
            pdf.text('Cotador: ' + element.cotador).fontSize(10);

            pdf.moveDown();
        });
        pdf.pipe(fs.createWriteStream(`./temp/cotacoes${aleat}.pdf`));
        pdf.end();
        setTimeout(()=>{
            res.sendFile(path.join(__dirname, '..', 'temp', `cotacoes${aleat}.pdf`))
        }, 2000)
        setTimeout(()=>{
            fs.unlinkSync(`./temp/cotacoes${aleat}.pdf`);
        }, 8000)
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/proposta-de-frete-semrev/pdf", async(req, res)=>{
    try {
        let resultados
        if(req.query.resultados == 'null' || req.query.resultados == undefined || req.query.resultados == '')
        {
            resultados = 1000
        }else{
            resultados = req.query.resultados
        }
        const pdf = new PDFKit();
        const aleat = Math.round(Math.random() * 1000);
        const response = await comercialModel.searchSemRevisao(req.query.pedido, resultados);
        pdf.text("Cotacoes: ")
        response.forEach(element => {
            pdf.text('ID: ' + element.id).fontSize(10);
            pdf.text('Pedido: ' + element.pedido).fontSize(10);
            pdf.text('Vendedor: ' + element.vendedor).fontSize(10);
            pdf.text('Status: ' + element.status).fontSize(10);
            pdf.text('Data Solicitação: ' + element.data_solicit).fontSize(10);
            pdf.text('Data Resposta: ' + element.data_resp).fontSize(10);
            pdf.text('Revisão: ' + element.revisao).fontSize(10);
            pdf.text('Valor: ' + element.valor).fontSize(10);
            pdf.text('Transportadora: ' + element.nome_transportadora).fontSize(10);
            pdf.text('Prazo: ' + element.prazo).fontSize(10);
            pdf.text('Cotador: ' + element.cotador).fontSize(10);

            pdf.moveDown();
        });
        pdf.pipe(fs.createWriteStream(`./temp/cotacoes${aleat}.pdf`));
        pdf.end();
        setTimeout(()=>{
            res.sendFile(path.join(__dirname, '..', 'temp', `cotacoes${aleat}.pdf`))
        }, 2000)
        setTimeout(()=>{
            fs.unlinkSync(`./temp/cotacoes${aleat}.pdf`);
        }, 8000)
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/proposta-de-frete/:id", async(req, res)=>{
    try {
        res.json(await comercialModel.proposta(req.params.id));
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.post("/proposta-de-frete/:id", async(req, res)=>{
    try {
        let today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        today = dd + '/' + mm + '/' + yyyy;

        await comercialModel.freteUpdate(req.body, req.params.id, today);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/sck/:numped", async(req, res)=>{
    try {
        const response = await axios.get(process.env.APITOTVS + "CONSULTA_SCK/get_all_id?idN=" + req.params.numped, {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
        res.send(response.data)
    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }
});

router.get("/clientes/:numped", async(req, res)=>{
    try {
        const response = await axios.get(process.env.APITOTVS + "CONSULTA_SA1/get_id?id=" + req.params.numped, {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
        res.send(response.data)
    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }
});

router.post("/nova-proposta-de-frete/:numped/:cotador/:filial", async(req, res)=>{
    try {
        let today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        today = dd + '/' + mm + '/' + yyyy;

        let revisao = await comercialModel.revisaoCotacao(req.params.numped);
        const response = await axios.get(process.env.APITOTVS + `CONSULTA_SCJ/get_id?id=${req.params.numped}&empresa=${req.params.filial}`, {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});

        let valorTotal = 0.0
        for(let i = 0; i < req.body.length; i++){
            valorTotal = valorTotal + req.body[i].valor
        };

        //Necessário criar 3 cotações
        if(revisao.length == 0){
            await comercialModel.novaProposta(req.params.numped, req.params.cotador, today, 1, response.data.cliente, valorTotal + response.data.xfreimp, req.params.filial);
            await comercialModel.novaProposta(req.params.numped, req.params.cotador, today, 1, response.data.cliente, valorTotal + response.data.xfreimp, req.params.filial);
            await comercialModel.novaProposta(req.params.numped, req.params.cotador, today, 1, response.data.cliente, valorTotal + response.data.xfreimp, req.params.filial);
            for(let i = 0; i < req.body.length; i++){
                await comercialModel.novosItens(req.params.numped, req.body[i]);
            };
        }else{
            await comercialModel.novaProposta(req.params.numped, req.params.cotador, today, parseInt(revisao[0].revisao) + 1, response.data.cliente, valorTotal + response.data.xfreimp, req.params.filial);
            await comercialModel.novaProposta(req.params.numped, req.params.cotador, today, parseInt(revisao[0].revisao) + 1, response.data.cliente, valorTotal + response.data.xfreimp, req.params.filial);
            await comercialModel.novaProposta(req.params.numped, req.params.cotador, today, parseInt(revisao[0].revisao) + 1, response.data.cliente, valorTotal + response.data.xfreimp, req.params.filial);
        };

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/proposta-frete-itens/:numped", async(req, res)=>{
    try {
        res.json(await comercialModel.freteItens(req.params.numped));
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/transportadoras", async(req, res)=>{
    try {
        const response = await axios.get(process.env.APITOTVS + "CONSULTA_SA4/get_all", {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
        res.json(response.data.objects)
    } catch (error) {
        console.log(error)
        res.sendStatus(500);
    }
});

router.get("/transportadoras/:nome", async(req, res)=>{
    try {
        const response = await axios.get(process.env.APITOTVS + "CONSULTA_SA4/get_all_like_nome?limit=20&pesquisa=" + req.params.nome, {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
        res.json(response.data.objects);
    } catch (error) {
        res.sendStatus(500);
    }
});

router.get("/update-frete-cot", async(req, res)=>{
    try {
        await axios.put(process.env.APITOTVS + `CONSULTA_SCJ/update_cst?num=${req.query.cj_num}&fts=${req.query.cj_cst_fts}&valor=${req.query.valor}&transp=${req.query.transp}`,"", {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/sa1", async(req, res)=>{
    try {
        res.json(await comercialModel.sa1());
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/sa1/:cod", async(req, res)=>{
    try {
        const response = await axios.get(process.env.APITOTVS + `CONSULTA_SA1/get_id?id=${req.params.cod}`, {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
        res.json(response.data);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/sa1-update", async(req, res)=>{
    try {
        const values = [];
        const limitador = await axios.get(process.env.APITOTVS + "CONSULTA_SA1/get_all", {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
        const response = await axios.get(process.env.APITOTVS + "CONSULTA_SA1/get_all?limit=" + limitador.data.meta.total, {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
        response.data.objects.forEach(response => {
            values.push([
                response.cod,
                response.nome,
                response.cod_mun,
                response.mun,
                response.nreduz,
                response.grpven,
                response.loja,
                response.end,
                response.codpais,
                response.est,
                response.cep,
                response.tipo,
                response.cgc,
                response.filial,
                response.xcartei
            ])
        });
        await comercialModel.updateSa1(values);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

router.get("/sa1-pesquisa", async(req, res)=>{
    try {
        let resultados
        if(req.query.resultados == 'null' || req.query.resultados == undefined || req.query.resultados == '')
        {
            resultados = 1000
        }else{
            resultados = req.query.resultados
        }
        res.json(await comercialModel.searchSa1(req.query.codigo, req.query.nome, resultados));
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.post("/sa1/api/update", async(req, res)=>{
    try {
        await axios.put(process.env.APITOTVS + `updatesa1/update/sa1`, req.body, {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}, Headers: {"tenantid": `01, 0101001, ailton souza, ${process.env.SENHAPITOTVS}`, "x-erp-module": "FAT"}});
        res.sendStatus(200)
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.post("/sa1/api/update-local", async(req, res)=>{
    try {
        await comercialModel.sa1UpdateLocal(req.body);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/sa3", async(req, res)=>{
    try {
        res.json(await comercialModel.sa3());
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/sa3/vendedor/:id", async(req, res)=>{
    try {
        res.json(await comercialModel.sa3Id(req.params.id));
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/sa3/update", async(req, res)=>{
    try {
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        const hoje = dd + '/' + mm + '/' + yyyy;

        const periodo = await comercialModel.tableUpdate('sa3')
        await comercialModel.tableUpdateAtualiza('sa3', hoje)

        const response = await axios.get(process.env.APITOTVS + `CONSULTA_SA3/get_all?updated_at=${periodo[0].data}&limit=10000`,
        {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});

        const tam_sa3 = await axios.get(process.env.APITOTVS + `CONSULTA_SA3/get_all?limit=10000`,
        {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});

        const tam_tabela = await comercialModel.tamanhoTabela()

        const diferencaTabelas = tam_sa3.data.meta.total - tam_tabela[0].contagem

        let values = [];
        response.data.objects.forEach(response => {
            values.push(
                {
                    "filial": response.filial,
                    "cod": response.cod,
                    "nome": response.nome,
                    "nreduz": response.nreduz,
                    "end": response.end,
                    "bairro": response.bairro,
                    "mun": response.mun,
                    "est": response.est,
                    "cep": response.cep,
                    "dddtel": response.dddtel,
                    "tel": response.tel,
                    "email": response.email,
                    "R_E_C_N_O_": response.R_E_C_N_O_,
                    "R_E_C_D_E_L_": response.R_E_C_D_E_L_
                }
            )
        });

        const limitArray = values.length - diferencaTabelas
        for (let i = 0; i < values.length; i ++){
            values.splice(0, limitArray)
        }

        // //insert de registros SOMENTE SE a tabela estiver vazia ou for adicionada uma nova coluna na tabela local
        // for(let i = 0; i < tam_sa3.data.objects.length; i++){
        //     await comercialModel.insertSa3(
        //         tam_sa3.data.objects[i].filial,
        //         tam_sa3.data.objects[i].cod, 
        //         tam_sa3.data.objects[i].nome,
        //         tam_sa3.data.objects[i].nreduz,
        //         tam_sa3.data.objects[i].end,
        //         tam_sa3.data.objects[i].bairro,
        //         tam_sa3.data.objects[i].mun,
        //         tam_sa3.data.objects[i].est,
        //         tam_sa3.data.objects[i].cep,
        //         tam_sa3.data.objects[i].dddtel,
        //         tam_sa3.data.objects[i].tel,
        //         tam_sa3.data.objects[i].email,
        //         tam_sa3.data.objects[i].R_E_C_N_O_,
        //         tam_sa3.data.objects[i].R_E_C_D_E_L_
        //     )
        // } 

        //insert de registros q não existem ainda
        if(diferencaTabelas != 0){
            for(let i = 0; i < values.length; i++){
                await comercialModel.insertSa3(
                    values[i].filial,
                    values[i].cod, 
                    values[i].nome,
                    values[i].nreduz,
                    values[i].end,
                    values[i].bairro,
                    values[i].mun,
                    values[i].est,
                    values[i].cep,
                    values[i].dddtel,
                    values[i].tel,
                    values[i].email,
                    values[i].R_E_C_N_O_,
                    values[i].R_E_C_D_E_L_
                )
            }
        }

        //update dos registros.
        for(let i = 0; i < response.data.objects.length; i++){
            await comercialModel.updateSa3(
                response.data.objects[i].filial,
                response.data.objects[i].cod, 
                response.data.objects[i].nome,
                response.data.objects[i].nreduz,
                response.data.objects[i].end,
                response.data.objects[i].bairro,
                response.data.objects[i].mun,
                response.data.objects[i].est,
                response.data.objects[i].cep,
                response.data.objects[i].dddtel,
                response.data.objects[i].tel,
                response.data.objects[i].email,
                response.data.objects[i].R_E_C_N_O_,
                response.data.objects[i].R_E_C_D_E_L_
            )
        }

        res.json(await comercialModel.sa3());
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.post("/sa3/api/update", async(req, res)=>{
    try {
        if(req.body.A3_CEP == '        ') req.body.A3_CEP = '82325200'
        await axios.put(process.env.APITOTVS + `CONSULTA_SA3/update`, req.body, {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}, Headers: {"tenantid": `01, 0101001, ailton souza, ${process.env.SENHAPITOTVS}`, "x-erp-module": "FAT"}});
        res.sendStatus(200)
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.post("/sa3/api/insert", async(req, res)=>{
    try {
        const response = await axios.get(process.env.APITOTVS + `CONSULTA_SA3/get_cod`,
        {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
        const a3CodAdd = (parseInt(response.data.objects[0].cod) + 1).toString().padStart(6, "0")
        const payload = {"A3_COD": a3CodAdd, "A3_NOME": req.body.A3_NOME};
        await axios.post(process.env.APITOTVS + `CONSULTA_SA3/insert`, payload, {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}, Headers: {"tenantid": `01, 0101001, ailton souza, ${process.env.SENHAPITOTVS}`, "x-erp-module": "FAT"}});
        res.sendStatus(200)
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.post("/sa3/api/delete", async(req, res)=>{
    try {
        await axios.delete(process.env.APITOTVS + `CONSULTA_SA3/delete`, {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}, Headers: {"tenantid": `01, 0101001, ailton souza, ${process.env.SENHAPITOTVS}`, "x-erp-module": "FAT"}, data: req.body});
        res.sendStatus(200)
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

router.get("/sa3/pesquisa", async(req, res)=>{
    try {
        if(!req.query.codigo) req.query.codigo = '';
        if(!req.query.nome) req.query.nome = '';
        if(!req.query.email) req.query.email = '';
        const response = await axios.get(process.env.APITOTVS + `CONSULTA_SA3/get_all?codigo=${req.query.codigo}&nome=${req.query.nome}&email=${req.query.email}&limit=10000`,
        {auth: {username: process.env.USERTOTVS, password: process.env.SENHAPITOTVS}});
        res.json(response.data.objects);
    } catch (error) {
        if(error.response.status = 404){
            res.json([]);
        }else{
            res.sendStatus(500);
        }
    }
});

module.exports = router;