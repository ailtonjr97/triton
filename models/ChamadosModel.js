const dotenv = require("dotenv");
dotenv.config();

async function connect(){
    const mysql = require("mysql2/promise");
    const pool = mysql.createPool({
        host: process.env.INTRANET_DB_HOMOLOG_IP,
        port: '3306',
        user: 'grafana',
        password: process.env.INTRANET_DB_HOMOLOG_PASSWORD,
        database: process.env.INTRANET_DB_HOMOLOG_DATABASE,
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

const all = async(setor)=>{
    const conn = await connect();
    const [rows] = await conn.query(`select * from chamados where status not in (6, 3) and chamado_setor_id = ${setor} and ativo = 's' and operacao_id not in (13, 15) order by id desc`);
    conn.end();
    return rows;
}

module.exports = {
    all
};