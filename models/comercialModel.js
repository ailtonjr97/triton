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
    const [rows] = await conn.query(`SELECT pf.*, u.name FROM docspro.proposta_frete as pf left join users as u on pf.cotador_id = u.id`);
    conn.end();
    return rows;
};

const search = async(pedido, resultados)=>{
    const conn = await connect();
    const [rows] = await conn.query(`SELECT * FROM docspro.proposta_frete WHERE pedido LIKE '%${pedido}%' ORDER BY id LIMIT ${resultados}`);
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

const novaProposta = async(numped, cotador, today, revisao)=>{
    const conn = await connect();
    await conn.query(
        `INSERT INTO docspro.proposta_frete (
            pedido,
            cotador_id,
            data_solicit,
            data_resp,
            revisao,
            valor,
            status,
            id_transportadora,
            prazo
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [numped, cotador, today, null, revisao, 0, 1, null, null]);
    conn.end();
};

const novosItens = async(numped, body)=>{
    const conn = await connect();
    await conn.query(
        `INSERT INTO docspro.proposta_frete_itens (
            proposta_frete_id,
            produto,
            qtdven,
            loja,
            descri,
            obs
        )
        VALUES (?, ?, ?, ?, ?, ?)`,
        [numped, body.produto, body.qtdven, body.loja, body.descri, body.obs]);
    conn.end();
};

const freteItens = async(numped)=>{
    const conn = await connect();
    const [rows] = await conn.query(`select * from proposta_frete_itens WHERE proposta_frete_id = ${numped}`);
    conn.end();
    return rows;
};

const revisaoCotacao = async(numped)=>{
    const conn = await connect();
    const [rows] = await conn.query(`select revisao from proposta_frete WHERE pedido = ${numped} order by id desc limit 1`);
    conn.end();
    return rows;
};

module.exports = {
    all,
    search,
    proposta,
    freteUpdate,
    novaProposta,
    novosItens,
    freteItens,
    revisaoCotacao
};