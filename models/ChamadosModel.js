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

const all = async(setor, designado)=>{
    const conn = await connect();
    const [rows] = await conn.query(`
    select chamados.id, users.name, 
    u_designado.name as designado, 
    chamados.descricao,
    areas_atuacaos.descricao as 'area',
    operacoes.descricao as 'operacoes',
    chamados.urgencia_id as 'urgencia'
    from chamados
    inner join users on chamados.usuario_id = users.id
    inner join users as u_designado on chamados.designado_id = u_designado.id
    inner join areas_atuacaos on chamados.area_id = areas_atuacaos.id
    inner join operacoes on chamados.operacao_id = operacoes.id
    where chamados.status not in (6, 3) and
    chamados.chamado_setor_id = ${setor} and
    chamados.designado_id in(${designado}, 0) and
    chamados.ativo = 's' and
    chamados.operacao_id not in (13, 15) and 
    terceiro_id IS NULL
    order by chamados.id desc
    `);
    conn.end();
    return rows;
}

const one = async(id)=>{
    const conn = await connect();
    const [rows] = await conn.query(`
        select chamado_setors.descricao as 'setor',
        areas_atuacaos.descricao as 'area',
        operacoes.descricao as 'operacoes',
        status_chamados.descricao as 'status',
        urgencias.descricao as 'urgencias',
        u_designado.name as 'designado'
        from chamados
        inner join users on chamados.usuario_id = users.id
        inner join users as u_designado on chamados.designado_id = u_designado.id
        inner join chamado_setors on chamados.chamado_setor_id = chamado_setors.id
        inner join areas_atuacaos on chamados.area_id = areas_atuacaos.id
        inner join operacoes on chamados.operacao_id = operacoes.id
        inner join status_chamados on chamados.status = status_chamados.id
        inner join urgencias on chamados.urgencia_id = urgencias.id
        where chamados.id = ${id}
    `);
    conn.end();
    return rows;
}

module.exports = {
    all,
    one
};