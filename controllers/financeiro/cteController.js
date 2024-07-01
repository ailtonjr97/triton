const axios = require('axios');
const fs = require('fs').promises;
const xml2js = require('xml2js');
const Client = require('ssh2-sftp-client');
const cteModel = require("../../models/financeiro/cteModel");
const {formatCurrency} = require('../../utils/protheus');
const path = require('path');
const { param } = require('../../routes/financeiroRoutes');

async function gridCte(req, res) {
    try {

        const {arquivado = 0, id = '', nf = '', cte = '', freteNf = '', freteCte = ''} = req.query

        const data = await cteModel.gridCteNf(arquivado, id, nf, cte, freteNf, freteCte);

        const grid = data.map(e => ({
            id: e.id,
            numero_nf:  e.numero_nf,
            numero_cte: e.numero_cte,
            frete_nf:   formatCurrency(e.frete_nf),
            frete_cte:  formatCurrency(e.frete_cte)
        }));

        res.json(grid);
    } catch (error) {
        console.error('Erro ao obter dados da tabela cte_nf:', error);
        res.sendStatus(500); // Envia o status 500 em caso de erro
    }
}

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

    function removeDuplicates(arr) {
        return [...new Set(arr)];
    }

    function chavePraNumero(str) {
            // Garantir que o item seja uma string
            str.toString();
            // Remover os 25 primeiros dígitos
            const trimmed = str.substring(25);
            // Manter apenas os primeiros 10 dígitos restantes
            return trimmed.substring(0, 9);
    }

    const directory = `/${process.env.FTPUSERNAME}/dev/importadorxml/lidos`;

    try {
        const chavesNf = await axios.get(`${process.env.APITOTVS}/CONSULTA_SF3/chave`, {
            auth: {
                username: process.env.USERTOTVS,
                password: process.env.SENHAPITOTVS
            }
        });

        let chaves = chavesNf.data.objects.map(element => element.F3_CHVNFE);

        chaves = removeDuplicates(chaves);

        await sftp.connect(sftpConfig);
        console.log('Conexão SFTP estabelecida.');

        const data = await sftp.list(directory);
        let trimmedArray = data.map(item => item.name.slice(0, 44));

        const kiko = trimmedArray.filter(element => element.length === 44 && /^\d+$/.test(element));

        let seuMadruga = getCommonElements(chaves, kiko);

        seuMadruga = removeDuplicates(seuMadruga);



        for (const [index, element] of seuMadruga.entries()) {
            const remoteFilePath = `/${process.env.FTPUSERNAME}/dev/importadorxml/lidos/${element}.xml`;
            const localFilePath = `./storage/cte/${element}.xml`;

            try {
                const fileExists = await sftp.exists(remoteFilePath);
                if (fileExists) {
                    await sftp.get(remoteFilePath, localFilePath);
                    console.log(`Arquivo ${element}.xml baixado com sucesso. Índice: ${index}`);

                    // Ler e analisar o conteúdo do arquivo XML
                    const xmlContent = await fs.readFile(localFilePath, { encoding: 'utf-8' });
                    const result = await xml2js.parseStringPromise(xmlContent);

                    // Extrair o valor da tag <chave>
                    const chave = result.cteProc?.CTe?.[0]?.infCte?.[0]?.infCTeNorm?.[0]?.infDoc?.[0]?.infNFe?.[0]?.chave[0];
                    const valFrete = result.cteProc?.CTe?.[0]?.infCte?.[0]?.vPrest?.[0]?.vTPrest[0]

                    let freteNf = 0.0;
                    if (chave) {

                        try {
                            freteNf = await axios.get(`${process.env.APITOTVS}/CONSULTA_SFT/get_chave?chave=${chave}`, {
                                auth: {
                                    username: process.env.USERTOTVS,
                                    password: process.env.SENHAPITOTVS
                                }
                            });
                        } catch (error) {
                            console.error(`Erro ao buscar freteNf: ${error}`);
                        }

                        if(freteNf.data.solution == 'A consulta de registros n�o retornou nenhuma informa��o'){
                            await cteModel.insertCteNf(chave, element, null, valFrete, chavePraNumero(chave), chavePraNumero(element))
                        }else{
                            await cteModel.insertCteNf(chave, element, freteNf.data.objects[0].FT_FRETE, valFrete, chavePraNumero(chave), chavePraNumero(element))
                            console.log(`Chave encontrada no arquivo ${element}.xml: ${chave}`);
                        }

                        try {
                            await axios.put(`${process.env.APITOTVS}/CONSULTA_SF3/grdcte?chave=${element}`, '', {
                                auth: {
                                    username: process.env.USERTOTVS,
                                    password: process.env.SENHAPITOTVS
                                }
                            });
                        } catch (error) {
                            console.error(`Erro ao atualizar F3_XGRDCTE CTE ${element}: ${error}`);
                        }


                    } else if (!chave) {
                        const chave = result.cteProc?.CTe?.[0]?.infCte?.[0]?.infCteComp?.[0]?.chCTe[0];

                        try {
                            freteNf = await axios.get(`${process.env.APITOTVS}/CONSULTA_SFT/get_chave?chave=${chave}`, {
                                auth: {
                                    username: process.env.USERTOTVS,
                                    password: process.env.SENHAPITOTVS
                                }
                            });
                        } catch (error) {
                            console.error(`Erro ao buscar freteNf: ${error}`);
                        }

                        if(freteNf.data.solution == 'A consulta de registros n�o retornou nenhuma informa��o'){
                            await cteModel.insertCteNf(chave, element, null, valFrete, chavePraNumero(chave), chavePraNumero(element))
                        }else{
                            await cteModel.insertCteNf(chave, element, freteNf.data.objects[0].FT_FRETE, valFrete, chavePraNumero(chave), chavePraNumero(element))
                            console.log(`Chave encontrada no arquivo (padrao diferente) ${element}.xml: ${chave}`);
                        }

                        try {
                            await axios.put(`${process.env.APITOTVS}/CONSULTA_SF3/grdcte?chave=${element}`, '', {
                                auth: {
                                    username: process.env.USERTOTVS,
                                    password: process.env.SENHAPITOTVS
                                }
                            });
                        } catch (error) {
                            console.error(`Erro ao atualizar F3_XGRDCTE CTE ${element}: ${error}`);
                        }

                    } else{
                        console.log(`Tag <chave> não encontrada no arquivo ${element}.xml`);
                    }
                } else {
                    console.log(`Arquivo ${element}.xml não encontrado no servidor FTP. Índice: ${index}`);
                }
            } catch (err) {
                console.error(`Erro ao verificar ou baixar o arquivo ${element}.xml no índice ${index}:`, err);
            }
        }

        await sftp.end();
        console.log('Conexão SFTP encerrada.');
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

async function arquivaCte(req, res) {
    try {
        await cteModel.arquivaCteNf(req.body.id);
        res.sendStatus(200)
    } catch (error) {
        console.error('Erro ao arquivar:', error);
        res.sendStatus(500); // Envia o status 500 em caso de erro
    }
}

async function pdfNf(req, res) {
    const {numero = ''} = req.query;

    try {
        const response = await axios.get(`${process.env.APITOTVS}/CONSULTA_SF2/pdfnf`, {
            params: {numero},
            auth: {
                username: process.env.USERTOTVS,
                password: process.env.SENHAPITOTVS
            }
        });

        res.json(response.data.objects)
    } catch (error) {
        res.sendStatus(500)
        console.error('Erro ao fazer a requisição:', error);
    }
  }

  async function roboBusca(req, res) {
    try {
        const { chave } = req.query;
        const puppeteer = require('puppeteer');
        const browser = await puppeteer.launch({headless: false, args: ['--disable-setuid-sandbox', '--no-sandbox']});
        const page = await browser.newPage();
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    
        // Monitorar novas páginas
        const [newPagePromise] = await Promise.all([
          new Promise(resolve => browser.once('targetcreated', target => resolve(target.page()))),
          // Navegar para a URL e preencher a chave
          page.goto('https://meudanfe.com.br/').then(async () => {
            await page.waitForSelector('input[placeholder="Digite a CHAVE DE ACESSO"]');
            await page.type('input[placeholder="Digite a CHAVE DE ACESSO"]', chave);
            await page.keyboard.press('Tab');
            await delay(1000);
            await page.keyboard.press('Enter');
            await delay(1000);
          })
        ]);
    
        const newPage = await newPagePromise;
    
        // Esperar a nova página carregar completamente
        await newPage.waitForSelector('embed, iframe, object', { timeout: 30000 });
    
        // Capturar a URL do PDF
        const pdfUrl = await newPage.evaluate(() => {
          const embed = document.querySelector('embed');
          if (embed && embed.src) {
            return embed.src;
          }
          const iframe = document.querySelector('iframe');
          if (iframe && iframe.src) {
            return iframe.src;
          }
          const object = document.querySelector('object');
          if (object && object.data) {
            return object.data;
          }
          return null;
        });
    
        if (!pdfUrl) {
          await browser.close();
          return res.status(500).send('Não foi possível encontrar o PDF.');
        }
    
        // Baixar o PDF
        const response = await fetch(pdfUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const storagePath = path.join(__dirname, 'storage');
        await fs.mkdir(storagePath, { recursive: true });

        await fs.writeFile(`./storage/nf/${chave}.pdf`, buffer);

        await browser.close();

        await delay(1000);

        res.download(path.join(__dirname, '../../storage/nf', `${chave}.pdf`));

    } catch (error) {
        res.sendStatus(500)
        console.error(error);
    }
  }

module.exports = { 
    refreshCte,
    gridCte,
    arquivaCte,
    pdfNf,
    roboBusca
};