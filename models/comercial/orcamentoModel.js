const dotenv = require("dotenv");
dotenv.config();

async function connect(){
    const mysql = require("mysql2/promise");
    const pool = mysql.createPool({
        host: process.env.SQLHOST,
        port: '3306',
        user: process.env.SQLUSER,
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

const orcamentos = async () => {
    let conn;
    try {
      conn = await connect();
      const [rows] = await conn.query(`SELECT * FROM ANALISE_CREDITO WHERE ARQUIVADO = 0`);
      return rows;
    } catch (error) {
      console.error('Erro ao executar a consulta:', error);
      throw error; // Propaga o erro para que o chamador possa tratá-lo
    } finally {
      if (conn) {
        await conn.end(); // Certifica-se de que a conexão será fechada
      }
    }
  };

module.exports = {
    orcamentos,
};