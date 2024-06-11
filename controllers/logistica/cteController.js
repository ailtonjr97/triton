const axios = require('axios');
const fs = require('fs');
const xml2js = require('xml2js');

async function refreshCte(req, res) {
    try {
        const Client = require('ssh2-sftp-client');
        const sftp = new Client();

        const sftpConfig = {
        host: process.env.FTPHOST, // Endereço do servidor SFTP
        port: process.env.FTPPORT, // Porta do servidor SFTP (padrão é 22)
        username: process.env.FTPUSERNAME, // Seu nome de usuário
        password: process.env.FTPPASSWORD // Sua senha
        };

        function getCommonElements(array1, array2) {
            // Usar um Set para eficiência de busca
            const set2 = new Set(array2);
            // Filtrar array1 para obter apenas os elementos que também estão em array2
            const commonElements = array1.filter(item => set2.has(item));
            return commonElements;
        }

        function addXmlExtension(array) {
            return array.map(item => `${item}.xml`);
        }

        const directory = '/ftp_C30D46_production/dev/importadorxml/lidos';
        const specificFileName = '41240511087284000111570010000394971000058150.xml'; // Nome do arquivo específico
        const localPath = `./storage/cte${specificFileName}`; // Caminho local onde o arquivo será salvo

        const chavesNf = await axios.get(`${process.env.APITOTVS}/CONSULTA_SF3/chave`, {
            auth: {
                username: process.env.USERTOTVS,
                password: process.env.SENHAPITOTVS
            }
        });

        const chaves = [];
        const kiko = [];
        chavesNf.data.objects.forEach(element => {
            chaves.push(element.F3_CHVNFE)
        });

        sftp.connect(sftpConfig)
        .then(() => {
            console.log('Conexão SFTP estabelecida.');
            return sftp.list(directory);
        })
        .then(data => {
            data.forEach(element => {
                // Remover a extensão .xml
                const nameWithoutExtension = element.name.replace('.xml', '');
            
                // Verificar se a string resultante tem exatamente 48 dígitos
                if (nameWithoutExtension.length === 44 && /^\d+$/.test(nameWithoutExtension)) {
                    kiko.push(nameWithoutExtension)
                }
            });
            const seuMadruga = getCommonElements(chaves, kiko);

            //41240582110818000202570000068051411012847730

            // Baixar o arquivo específico
            return sftp.get(`/ftp_C30D46_production/dev/importadorxml/lidos/35240503410332000213570020002868661006163230.xml`, `./storage/cte/35240503410332000213570020002868661006163230.xml`);
        })
        .then(() => {
            fs.readFile(`./storage/cte/35240503410332000213570020002868661006163230.xml`, (err, data) => {
              if (err) throw err;
        
              xml2js.parseString(data, (err, result) => {
                if (err) throw err;
        
                // Navegar pela estrutura do XML para encontrar a tag nProt
                const chave = result['cteProc']['CTe'][0]['infCte'][0]['infCTeNorm'][0]['infDoc'][0]['infNFe'][0]['chave'][0];
                console.log(`Valor da tag chave: ${chave}`);
              });
            });
          })
        .catch(err => {
            console.log(err)
            throw new Error
        })
        .finally(() => {
            return sftp.end();
        });
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}


module.exports = { 
    refreshCte
};