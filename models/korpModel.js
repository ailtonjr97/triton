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
}

const search = async(codigo, resultados)=>{
    await sql.connect(sqlConfig);
    const estoqueQuery = `SELECT TOP (${resultados}) CODIGO, DESCRI FROM ESTOQUE WHERE CODIGO LIKE '%${codigo}%' ORDER BY CODIGO`;
    const estoque = await sql.query(estoqueQuery);
    return estoque.recordset;
}

const product = async(codigo)=>{
  await sql.connect(sqlConfig);
  const productQuery = `SELECT * FROM ESTOQUE WHERE CODIGO = '${codigo}'`;
  const product = await sql.query(productQuery);
  return product.recordset;
}

module.exports = {
    all,
    search,
    product
};