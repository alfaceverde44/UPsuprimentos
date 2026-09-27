const pool = require('../config/db');
 
async function listar() {
  const [linhas] = await pool.query(
    'SELECT * FROM categoria ORDER BY nome'
  );
  return linhas;
}
 
async function buscarPorId(id) {
  const [linhas] = await pool.query(
    'SELECT * FROM categoria WHERE ID_categoria = ?',  // O ? representa o valor que será passado separadamente.
    [id]
  );
  return linhas[0];
}
 
async function criar({ nome, descricao }) {
  const [r] = await pool.query(
    'INSERT INTO categoria (nome, descricao) VALUES (?, ?)', 
  );
  return { ID_categoria: r.insertId, nome, descricao };
}
 
async function atualizar(id, { nome, descricao }) {
  await pool.query(
    'UPDATE categoria SET nome = ?, descricao = ? WHERE ID_categoria = ?',
    [nome, descricao, id]
  );
  return buscarPorId(id);
}
 
async function excluir(id) {
  const [r] = await pool.query('DELETE FROM categoria WHERE ID_categoria = ?', [id]);
  return r.affectedRows > 0; 

  // affectedRows informa quantas linhas foram afetadas pelo DELETE.
  // Se for maior que 0, significa que uma categoria foi excluída.
  // Retorna true se excluiu e false se não encontrou a categoria.
}
 
