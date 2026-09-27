const pool = require('../config/db');

async function buscarPorEmail(email) {
  const [linhas] = await pool.query(
    'SELECT * FROM usuario WHERE email = ?',
    [email]
  );

  return linhas[0]; // undefined se nao achar
}

async function buscarPorID(ID_usuario) {
  const [linhas] = await pool.query(
    `SELECT ID_usuario, nome, email, tipo, data_criacao
     FROM usuario
     WHERE ID_usuario = ?`,
    [ID_usuario]
  );

  return linhas[0];
}

async function criar({ nome, email, senha_hash }) {
  const [resultado] = await pool.query(
    `INSERT INTO usuario (nome, email, senha_hash)
     VALUES (?, ?, ?)`, 
    [nome, email, senha_hash]
  );

  return {
    ID_usuario: resultado.insertId,
    nome,
    email
  };
}

module.exports = {
  buscarPorEmail,
  buscarPorID,
  criar
};