import mysql from 'mysql2'

var connection = mysql.createPool({
  host: "localhost",
  user: "virent_uz",
  password: "ejw1F39A17iQzpJy",
  database: "virent_uz",
}).promise();

export const  getAll = async () => {
  const table = 'product'
  const [query] = await connection.query('SELECT * FROM ??', table)

  return query
}