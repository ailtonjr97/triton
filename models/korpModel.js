const sql = require('mssql');

const sqlConfig = {
    user: process.env.MSUSER,
    password: process.env.MSPASSWORD,
    database: process.env.MSDATABASE,
    server: process.env.MSSERVER,
    pool: {
      max: 40,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: false, // for azure
      trustServerCertificate: true // change to true for local dev / self-signed certs
    }
};

const all = async()=>{
    await sql.connect(sqlConfig);
    const estoqueQuery = `SELECT TOP (1000) ID, CODIGO, DESCRI FROM ESTOQUE`;
    const estoque = await sql.query(estoqueQuery);
    return estoque.recordset;
};

const search = async(codigo, resultados)=>{
    await sql.connect(sqlConfig);
    const estoqueQuery = `SELECT TOP (${resultados}) CODIGO, DESCRI FROM ESTOQUE WHERE CODIGO LIKE '%${codigo}%' ORDER BY CODIGO`;
    const estoque = await sql.query(estoqueQuery);
    return estoque.recordset;
};

const product = async(codigo)=>{
  await sql.connect(sqlConfig);
  const productQuery = `SELECT * FROM ESTOQUE WHERE CODIGO = '${codigo}'`;
  const product = await sql.query(productQuery);
  return product.recordset;
};

const allPedidosDeCompra = async()=>{
  await sql.connect(sqlConfig);
  const estoqueQuery = `SELECT TOP (1000) NDOC, RASSOC, REQUISITANTE FROM PEDIDO_FOR ORDER BY NDOC DESC`;
  const estoque = await sql.query(estoqueQuery);
  return estoque.recordset;
};

const searchPedidosDeCompra = async(codigo, resultados, rassoc)=>{
  await sql.connect(sqlConfig);
  const estoqueQuery = `SELECT TOP (${resultados}) NDOC, RASSOC, REQUISITANTE FROM PEDIDO_FOR WHERE NDOC LIKE '%${codigo}%' AND RASSOC LIKE '%${rassoc}%' ORDER BY NDOC DESC`;
  const estoque = await sql.query(estoqueQuery);
  return estoque.recordset;
};

const pedidoDeCompra = async(codigo)=>{
  await sql.connect(sqlConfig);
  const productQuery = `SELECT * FROM PEDIDO_FOR WHERE NDOC = '${codigo}'`;
  const product = await sql.query(productQuery);
  return product.recordset;
};

const uncryptObs = async(codigo)=>{
  await sql.connect(sqlConfig);
  const productQuery = `SELECT CAST(CAST (OBS1 AS varbinary(MAX)) AS VARCHAR(MAX)) as obs FROM PEDIDO_FOR WHERE NDOC = ${codigo}`;
  const product = await sql.query(productQuery);
  return product.recordset;
};

module.exports = {
    all,
    search,
    product,
    allPedidosDeCompra,
    searchPedidosDeCompra,
    pedidoDeCompra,
    uncryptObs
};