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
    const [rows] = await conn.query(`
        select id, nome from entidades order by id desc
    `);
    conn.end();
    return rows;
}

const create = async(body)=>{
    const conn = await connect();
    await conn.query(
        `INSERT INTO docspro.entidades (
            natureza, 
            regime, 
            nome, 
            endereco, 
            endereco_numero, 
            bairro, 
            cidade, 
            pais
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [body.natureza, body.regime, body.nome, body.endereco, body.endereco_numero, body.bairro, body.cidade, body.pais]);
    conn.end();
}

module.exports = {
    all,
    create
};