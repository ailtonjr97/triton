const dotenv = require("dotenv");
dotenv.config();

async function connect(){
    const mysql = require("mysql2/promise");
    const pool = mysql.createPool({
        host: process.env.SQLHOST,
        port: '3306',
        user: 'docs_admin',
        password: process.env.SQLPASSWORD,
        database: process.env.SQLDATABASE,
        waitForConnections: true,
        connectionLimit: 100,
        maxIdle: 100, // max idle connections, the default value is the same as `connectionLimit`
        idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 10000
      });
    return pool;
}

connect();

const all = async()=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT id, tipo_doc, data, inspetor, edp_preenchido, pcp_preenchido, producao_preenchido, qualidade_preenchido FROM docspro.docs_qualidade ORDER BY id DESC');
    conn.end();
    return rows;
}

const one = async(id)=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM docspro.docs_qualidade WHERE id = ?', id);
    conn.end();
    return rows;
}

const inspetores = async(setor)=>{
    const conn = await connect();
    const [rows] = await conn.query("SELECT id, name FROM docspro.users WHERE setor = ? AND active = 1", setor);
    conn.end();
    return rows;
}

const create = async(body)=>{
    const conn = await connect();
    await conn.query(
        `INSERT INTO docspro.docs_qualidade (
            tipo_doc, 
            data, 
            inspetor, 
            cod_prod, 
            descri, 
            lote_odf, 
            lance, 
            quantidade_metragem, 
            cpnc_numero, 
            motivo_nc,
            edp_preenchido,
            pcp_preenchido,
            producao_preenchido,
            qualidade_preenchido
        )
        VALUES ('FOR-EDP-025', ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0)`,
    [body.data, body.inspetor, body.cod_prod, body.descri, body.lote_odf, body.lance, body.quantidade_metragem, body.cpnc_numero, body.motivo_nc]);
    conn.end();
}

const edpUpdate = async(body, id)=>{
    const conn = await connect();
    await conn.query(`
        UPDATE docspro.docs_qualidade SET
        tempo_previsto = ?,
        instrucao_reprocesso = ?,
        edp_responsavel = ?,
        edp_data = ?,
        edp_preenchido = 1
        WHERE id = ?
    `, [body.tempo_previsto, body.instrucao_reprocesso, body.edp_responsavel, body.edp_data, id]);
    conn.end();
}

const pcpUpdate = async(body, id)=>{
    const conn = await connect();
    await conn.query(`
        UPDATE docspro.docs_qualidade SET
        pcp_odf_retrabalho = ?,
        pcp_responsavel = ?,
        pcp_data = ?,
        pcp_obs = ?,
        pcp_preenchido = 1
        WHERE id = ?
    `, [body.pcp_odf_retrabalho, body.pcp_responsavel, body.pcp_data, body.pcp_obs, id]);
    conn.end();
}

const producaoUpdate = async(body, id)=>{
    const conn = await connect();
    await conn.query(`
        UPDATE docspro.docs_qualidade SET
        prod_tempo_realizado = ?,
        prod_insumos = ?,
        prod_sucata = ?,
        prod_obs = ?,
        prod_responsavel = ?,
        prod_data = ?,
        prod_status = ?,
        producao_preenchido = 1
        WHERE id = ?
    `, [body.prod_tempo_realizado, body.prod_insumos, body.prod_sucata, body.prod_obs, body.prod_responsavel, body.prod_data, body.prod_status, id]);
    conn.end();
}

const qualidadeUpdate = async(body, id)=>{
    const conn = await connect();
    await conn.query(`
        UPDATE docspro.docs_qualidade SET
        quali_parecer = ?,
        quali_responsavel = ?,
        quali_data = ?,
        quali_status = ?,
        qualidade_preenchido = 1
        WHERE id = ?
    `, [body.quali_parecer, body.quali_responsavel, body.quali_data, body.quali_status, id]);
    conn.end();
}

module.exports = {
    all,
    one,
    inspetores,
    create,
    edpUpdate,
    pcpUpdate,
    producaoUpdate,
    qualidadeUpdate
};