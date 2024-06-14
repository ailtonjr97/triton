const dotenv = require("dotenv");
dotenv.config();

async function connect(){
    const mysql = require("mysql2/promise");
    const pool = mysql.createPool({
        host: process.env.SQLHOST2,
        port: '3306',
        user: process.env.SQLUSER2,
        password: process.env.SQLPASSWORD2,
        database: process.env.SQLDATABASE2,
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

const gridCteNf = async (arquivado, id, nf, cte, freteNf, freteCte) => {
    let conn;

    try {
        conn = await connect();
        const query = `
            SELECT * FROM cte_nf
            WHERE arquivado = ? 
            AND id LIKE ?
            AND chave_nf   LIKE ?
            AND chave_cte  LIKE ?
            AND (frete_nf  LIKE ? OR frete_nf IS NULL)
            AND (frete_cte LIKE ? OR frete_cte IS NULL)
            ORDER BY id DESC
        `;
        const values = [arquivado, `%${id}%`, `%${nf}%`, `%${cte}%`, `%${freteNf}%`, `%${freteCte}%`];
        const [result] = await conn.query(query, values);
        return result;
    } catch (error) {
        console.error('Erro ao executar consulta:', error);
        throw error; // Propaga o erro para que o chamador possa tratá-lo
    } finally {
        if (conn) {
            await conn.end(); // Certifica-se de que a conexão será fechada
        }
    }
};


const insertCteNf = async (chaveNf, chaveCte, freteNf, freteCte, numeroNf, numeroCte) => {
    let conn;

    try {
        conn = await connect();
        const query = `
            INSERT INTO cte_nf (chave_nf, chave_cte, frete_nf, frete_cte, numero_nf, numero_cte)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [chaveNf, chaveCte, freteNf, freteCte, numeroNf, numeroCte];
        const [result] = await conn.query(query, values);
        return result;
    } catch (error) {
        console.error('Erro ao executar a inserção:', error);
        throw error; // Propaga o erro para que o chamador possa tratá-lo
    } finally {
        if (conn) {
            await conn.end(); // Certifica-se de que a conexão será fechada
        }
    }
};

const arquivaCteNf = async (id) => {
    let conn;

    try {
        conn = await connect();
        const query = `UPDATE cte_nf SET arquivado = 1 WHERE id = ?`;
        const values = [id];
        const [result] = await conn.query(query, values);
        return result;
    } catch (error) {
        console.error('Erro ao executar a atualização:', error);
        throw error; // Propaga o erro para que o chamador possa tratá-lo
    } finally {
        if (conn) {
            await conn.end(); // Certifica-se de que a conexão será fechada
        }
    }
};

module.exports = {
    gridCteNf,
    insertCteNf,
    arquivaCteNf
};