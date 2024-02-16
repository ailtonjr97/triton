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

const all = async(setor, designado)=>{
    const conn = await connect();
    const [rows] = await conn.query(`SELECT * FROM docspro.proposta_frete`);
    conn.end();
    return rows;
};

const search = async(pedido, resultados)=>{
    const conn = await connect();
    const [rows] = await conn.query(`SELECT id, pedido, cotador_id FROM proposta_frete WHERE pedido LIKE '%${pedido}%' ORDER BY id LIMIT ${resultados}`);
    conn.end();
    return rows;
};

const proposta = async(id)=>{
    const conn = await connect();
    const [rows] = await conn.query(`select * from proposta_frete WHERE id = ${id}`);
    conn.end();
    return rows;
};

const freteUpdate = async(body, id)=>{
    const conn = await connect();
    await conn.query(`
        UPDATE docspro.proposta_frete SET
        valor = ?,
        id_transportadora = ?,
        prazo = ?
        WHERE id = ?
    `, [body.valor, body.id_transportadora, body.prazo, id]);
    conn.end();
};

module.exports = {
    all,
    search,
    proposta,
    freteUpdate
};