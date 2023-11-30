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
    const [rows] = await conn.query('SELECT id, name, email FROM users WHERE active = 1 ORDER BY name');
    conn.end();
    return rows;
}

let one = async(id)=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT name, email, admin, dpo, setor FROM users WHERE id = ?', [id]);
    conn.end();
    return rows;
}

let allInactives = async()=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT id, name, email FROM users WHERE active = 0');
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

let inactivateUser = async(id)=>{
    const conn = await connect();
    await conn.query('UPDATE docspro.users SET active = 0 WHERE id = ?', [id]);
    conn.end();
}

let reactivateUser = async(id)=>{
    const conn = await connect();
    await conn.query('UPDATE docspro.users SET active = 1 WHERE id = ?', [id]);
    conn.end();
}

let updateOne = async(name, email, admin, dpo, setor, id)=>{
    const conn = await connect();
    const [rows] = await conn.query('UPDATE docspro.users SET name = ?, email = ?, admin = ?, dpo = ?, setor = ? WHERE id = ?', [
        name,
        email,
        admin,
        dpo,
        setor,
        id
    ]);
    conn.end();
    return rows;
}

let passwordReset = async(password, id)=>{
    const conn = await connect();
    await conn.query('UPDATE docspro.users SET password = ? WHERE id = ?', [password, id])
    return true;
}

let emailCheck = async(email)=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT * FROM docspro.users WHERE email = ? AND active = 1', [email])
    return rows;
}

let passwordReturn = async(email)=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT password FROM docspro.users WHERE email = ? AND active = 1', [email])
    return rows;
}

let getUserJwt = async(email)=>{
    const conn = await connect();
    const [rows] = await conn.query('SELECT id FROM docspro.users WHERE email = ? AND active = 1', [email])
    return rows;
}

module.exports = {
    all,
    register,
    userRegisterConfirmation,
    allInactives,
    reactivateUser,
    one,
    updateOne,
    inactivateUser,
    passwordReset,
    emailCheck,
    passwordReturn,
    getUserJwt
};