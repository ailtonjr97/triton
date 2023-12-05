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
    const [rows] = await conn.query('SELECT id, tipo_doc, data, inspetor, edp_preenchido FROM docspro.docs_qualidade ORDER BY id DESC');
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
            motivo_nc
        )
        VALUES ('FOR-EDP-025', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

module.exports = {
    all,
    one,
    inspetores,
    create,
    edpUpdate
};