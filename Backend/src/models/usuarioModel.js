const pool = require('../config/db');
async function buscarPorEmail(email) {
  const [linhas] = await pool.query(
    'SELECT * FROM usuarios WHERE email = ?',
    [email]
  );
  return linhas[0]; // undefined se nao achar
}
 
async function buscarPorId(id) {
  const [linhas] = await pool.query(
    'SELECT id, nome, email, tipo, data_criacao FROM usuarios WHERE id = ?',
    [id]
  );
  return linhas[0];
}
 
async function criar({ nome, email, senha_hash }) {
  const [resultado] = await pool.query(
    'INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)',
    [nome, email, senha_hash]
  );
  return { id: resultado.insertId, nome, email };
}
 
module.exports = { buscarPorEmail, buscarPorId, criar };