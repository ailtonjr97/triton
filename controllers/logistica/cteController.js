const axios = require('axios');
const fs = require('fs');
const xml2js = require('xml2js');
const Client = require('ssh2-sftp-client');

async function refreshCte(req, res) {
    const sftp = new Client();

    const sftpConfig = {
        host: process.env.FTPHOST,
        port: process.env.FTPPORT,
        username: process.env.FTPUSERNAME,
        password: process.env.FTPPASSWORD
    };

    function getCommonElements(array1, array2) {
        const set2 = new Set(array2);
        return array1.filter(item => set2.has(item));
    }

    function addXmlExtension(array) {
        return array.map(item => `${item}.xml`);
    }

    const directory = '/ftp_C30D46_development/dev/importadorxml/lidos';

    try {
        const chavesNf = await axios.get(`${process.env.APITOTVS}/CONSULTA_SF3/chave`, {
            auth: {
                username: process.env.USERTOTVS,
                password: process.env.SENHAPITOTVS
            }
        });

        const chaves = chavesNf.data.objects.map(element => element.F3_CHVNFE);

        await sftp.connect(sftpConfig);
        console.log('Conexão SFTP estabelecida.');

        const data = await sftp.list(directory);
        let trimmedArray = data.map(item => item.name.slice(0, 44));

        const kiko = trimmedArray.filter(element => element.length === 44 && /^\d+$/.test(element));

        const seuMadruga = getCommonElements(chaves, kiko);

        console.log([chaves.length, kiko.length, seuMadruga.length])

        console.log(chaves.find(e=>e == '41240529358706000101570010004334571007616520'))
        console.log(kiko.find(e=>e == '41240529358706000101570010004334571007616520'))
        console.log(seuMadruga.find(e=>e == '41240529358706000101570010004334571007616520'))

        // for (const element of seuMadruga) {
        //     try {
        //         await sftp.get(`/ftp_C30D46_production/dev/importadorxml/lidos/${element}.xml`, `./storage/cte/${element}.xml`);
        //         console.log(`Arquivo ${element}.xml baixado com sucesso.`);
        //     } catch (err) {
        //         console.error(`Erro ao baixar o arquivo ${element}.xml:`, err);
        //     }
        // }

        await sftp.end();
        console.log('Conexão SFTP encerrada.');
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

module.exports = { 
    refreshCte
};
