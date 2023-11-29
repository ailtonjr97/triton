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

let all = async()=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM users');
    conn.end();
    return rows;
}

let allInactives = async()=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM users WHERE active = 0');
    conn.end();
    return rows;
}

let register = async(name, email, password, admin, setor)=>{
    const conn = await connect();
    const [rows] = await conn.query('INSERT INTO docspro.users (name, email, password, salt, active, admin, jwt, intranet_id, dpo, setor) VALUES (?, ?, ?, 10, 1, ?, 0, 0, 0, ?)', [
        name,
        email,
        password,
        admin,
        setor
    ]);
    conn.end();
    return rows;
}

let userRegisterConfirmation = async(email)=>{
    const conn = await connect();
    const [rows] = await conn.query(`SELECT id FROM users WHERE email = '${email}'`);
    conn.end();
    return rows;
}

let reactivateUser = async(id)=>{
    const conn = await connect();
    await conn.query('UPDATE docspro.users SET active = 1 WHERE id = ?', [id]);
    conn.end();
}

module.exports = {
    all,
    register,
    userRegisterConfirmation,
    allInactives,
    reactivateUser
};