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

const all = async()=>{
    const conn = await connect();
    const [rows] = await conn.query(`SELECT pf.*, u.name as 'vendedor', u2.name as 'cotador' FROM PRODUCAO.proposta_frete as pf left join users as u on pf.cotador_id = u.id left join users as u2 on pf.cotador_id_2 = u2.id  where revisao = (select Max(revisao) from proposta_frete as pf2 where pf2.pedido=pf.pedido) order by id desc`);
    conn.end();
    return rows;
};

const allSemRevisao = async()=>{
    const conn = await connect();
    const [rows] = await conn.query(`SELECT pf.*, u.name as 'vendedor', u2.name as 'cotador' FROM PRODUCAO.proposta_frete as pf left join users as u on pf.cotador_id = u.id left join users as u2 on pf.cotador_id_2 = u2.id`);
    conn.end();
    return rows;
};

const search = async(codigo, resultados)=>{
    const conn = await connect();
    const [rows] = await conn.query(`SELECT pf.*, u.name as 'vendedor', u2.name as 'cotador' FROM PRODUCAO.proposta_frete as pf left join users as u on pf.cotador_id = u.id left join users as u2 on pf.cotador_id_2 = u2.id  where revisao = (select Max(revisao) from proposta_frete as pf2 where pf2.pedido=pf.pedido) and pedido LIKE '%${codigo}%' order by id desc LIMIT ${resultados}`);
    conn.end();
    return rows;
};

const searchSemRevisao = async(codigo, resultados)=>{
    const conn = await connect();
    const [rows] = await conn.query(`SELECT pf.*, u.name as 'vendedor', u2.name as 'cotador' FROM PRODUCAO.proposta_frete as pf left join users as u on pf.cotador_id = u.id left join users as u2 on pf.cotador_id_2 = u2.id WHERE pedido LIKE '%${codigo}%' LIMIT ${resultados}`);
    conn.end();
    return rows;
};

const proposta = async(id)=>{
    const conn = await connect();
    const [rows] = await conn.query(`select * from proposta_frete WHERE id = ${id}`);
    conn.end();
    return rows;
};

const freteUpdate = async(body, id, today)=>{
    const conn = await connect();
    await conn.query(`
        UPDATE PRODUCAO.proposta_frete SET
        data_resp = ?,
        valor = ?,
        id_transportadora = ?,
        prazo = ?,
        nome_transportadora = ?,
        cotador_id_2 = ?
        WHERE id = ?
    `, [today, body.valor, body.transp_nome_select, body.prazo, body.transp_nome2_select, body.cotador_id_2, id]);
    conn.end();
};

const novaProposta = async(numped, cotador, today, revisao, cliente, valor_pedido, filial)=>{
    const conn = await connect();
    await conn.query(
        `INSERT INTO PRODUCAO.proposta_frete (
            pedido,
            cotador_id,
            data_solicit,
            data_resp,
            revisao,
            valor,
            status,
            id_transportadora,
            prazo,
            cliente,
            valor_pedido,
            filial
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [numped, cotador, today, null, revisao, 0, 1, null, null, cliente, valor_pedido, filial]);
    conn.end();
};

const novosItens = async(numped, body)=>{
    const conn = await connect();
    await conn.query(
        `INSERT INTO PRODUCAO.proposta_frete_itens (
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

const sa1 = async()=>{
    const conn = await connect();
    const [rows] = await conn.query(`SELECT id, cod, nome FROM sa1 limit 1000`);
    conn.end();
    return rows;
};

const updateSa1 = async(values)=>{
    const conn = await connect();
    await conn.query("TRUNCATE PRODUCAO.sa1");
    await conn.query(`INSERT INTO PRODUCAO.sa1 (
        cod, 
        nome,
        cod_mun,
        mun,
        nreduz,
        grpven,
        loja,
        end,
        codpais,
        est,
        cep,
        tipo,
        cgc,
        filial,
        xcartei
    ) VALUES ?`, [values]);
    conn.end();
}

const searchSa1 = async(codigo, nome, resultados)=>{
    const conn = await connect();
    const [rows] = await conn.query(`SELECT id, cod, nome FROM sa1 WHERE cod LIKE '%${codigo}%' AND nome LIKE '%${nome}%' limit ${resultados}`);
    conn.end();
    return rows;
};

const sa1Unico = async(cod)=>{
    const conn = await connect();
    const [rows] = await conn.query(`SELECT * FROM sa1 WHERE cod = '${cod}'`);
    conn.end();
    return rows;
};

const sa1UpdateLocal = async(body)=>{
    const conn = await connect();
    await conn.query(`
        UPDATE PRODUCAO.sa1 SET
        nome = ?
        WHERE cod = ?
    `, [body.A1_NOME, body.A1_COD]);
    conn.end();
};

const tamanhoTabela = async()=>{
    const conn = await connect();
    const [rows] = await conn.query(`SELECT count(id) as 'contagem' FROM sa3`);
    conn.end();
    return rows;
};

const sa3 = async()=>{
    const conn = await connect();
    const [rows] = await conn.query(`SELECT id, filial, cod, nome, email FROM sa3 WHERE R_E_C_D_E_L_ = 0`);
    conn.end();
    return rows;
};

const sa3Id = async(id)=>{
    const conn = await connect();
    const [rows] = await conn.query(`SELECT * FROM sa3 WHERE id = ${id}`);
    conn.end();
    return rows;
};

const truncateSa3 = async(values)=>{
    const conn = await connect();
    await conn.query("TRUNCATE PRODUCAO.sa3");
    conn.end();
}

const insertSa3 = async(filial, cod, nome, nreduz, end, bairro, mun, est, cep, dddtel, tel, email, R_E_C_N_O_, R_E_C_D_E_L_)=>{
    const conn = await connect();
    await conn.query(`INSERT INTO PRODUCAO.sa3 (
        filial,
        cod,
        nome,
        nreduz,
        end,
        bairro,
        mun,
        est,
        cep,
        dddtel,
        tel,
        email,
        R_E_C_N_O_,
        R_E_C_D_E_L_
    ) VALUES ('${filial}', '${cod}', '${nome}', '${nreduz}', '${end}', '${bairro}', '${mun}', '${est}', '${cep}', '${dddtel}', '${tel}', '${email}', '${R_E_C_N_O_}', '${R_E_C_D_E_L_}')`);
    conn.end();
}

const updateSa3 = async(filial, cod, nome, nreduz, end, bairro, mun, est, cep, dddtel, tel, email, R_E_C_N_O_, R_E_C_D_E_L_)=>{
    const conn = await connect();
    await conn.query(`
        UPDATE PRODUCAO.sa3 SET
        filial = ?,
        cod = ?,
        nome = ?,
        nreduz = ?,
        end = ?,
        bairro = ?,
        mun = ?,
        est = ?,
        cep = ?,
        dddtel = ?,
        tel = ?,
        email = ?,
        R_E_C_N_O_ = ?,
        R_E_C_D_E_L_ = ?
        WHERE cod = ?
        and filial = ?
    `, [filial, cod, nome, nreduz, end, bairro, mun, est, cep, dddtel, tel, email, R_E_C_N_O_, R_E_C_D_E_L_, cod, filial]);
    conn.end();
};

const tableUpdate = async(tabela)=>{
    const conn = await connect();
    const [rows] = await conn.query(`select date as 'data' from tables_update WHERE table_name = '${tabela}'`);
    conn.end();
    return rows;
};

const tableUpdateAtualiza = async(tabela, hoje)=>{
    const conn = await connect();
    await conn.query(`
        UPDATE PRODUCAO.tables_update SET
        date = ?
        WHERE table_name = ?
    `, [hoje, tabela]);
    conn.end();
};

const trackOrder = async()=>{
    const conn = await connect();
    const [rows] = await conn.query(`SELECT * FROM track_order`);
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
    revisaoCotacao,
    allSemRevisao,
    searchSemRevisao,
    sa1,
    updateSa1,
    searchSa1,
    sa1Unico,
    sa1UpdateLocal,
    sa3,
    insertSa3,
    truncateSa3,
    updateSa3,
    tamanhoTabela,
    sa3Id,
    tableUpdate,
    tableUpdateAtualiza,
    trackOrder
};