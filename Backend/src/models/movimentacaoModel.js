const pool = require('../config/db');
 
async function listar() {
  const [linhas] = await pool.query(
    `SELECT m.*, p.nome AS produto_nome, u.nome AS usuario_nome
       FROM movimentacao m
       JOIN produto p ON p.ID_produto = m.ID_produto
       JOIN usuario u ON u.ID_usuario = m.ID_usuario
      ORDER BY m.data_criacao DESC`
  );
  return linhas;
}
 
async function buscarPorId(id) {
  const [linhas] = await pool.query(
    `SELECT m.*, p.nome AS produto_nome, u.nome AS usuario_nome
       FROM movimentacao m
       JOIN produto p ON p.ID_produto = m.ID_produto
       JOIN usuario u ON u.ID_usuario = m.ID_usuario
      WHERE m.ID_movimentacao = ?`,
    [id]
  );
  return linhas[0];
}
 
async function criar({ ID_produto, ID_usuario, tipo, quantidade, descricao}) {
  const [r] = await pool.query(
    `INSERT INTO movimentacao
       (ID_produto, ID_usuario, tipo, quantidade, descricao)
     VALUES (?, ?, ?, ?, ?)`,
    [ID_produto, ID_usuario, tipo, quantidade, descricao]
  );
  return buscarPorId(r.insertId);
}
 
async function excluir(id) {
  const [r] = await pool.query('DELETE FROM movimentacao WHERE ID_movimentacao = ?', [id]);
  return r.affectedRows > 0;
}
 
// Usada pela dashboard: totais gerais do estoque.
async function resumo() {
  const [[totProduto]] = await pool.query(
    'SELECT COUNT(*) AS total FROM produto'
  );
  const [[totCategoria]] = await pool.query(
    'SELECT COUNT(*) AS total FROM categoria'
  );
  const [[itensEstoque]] = await pool.query(
    'SELECT COALESCE(SUM(quantidade),0) AS total FROM produto'
  );
  const [[valorEstoque]] = await pool.query(
    'SELECT COALESCE(SUM(preco * quantidade),0) AS total FROM produto'
  );
  const [abaixoMinimo] = await pool.query(
    `SELECT ID_produto, nome, quantidade, estoque_minimo
       FROM produto
      WHERE quantidade <= estoque_minimo
      ORDER BY quantidade ASC`
  );
  return {
    total_produto: totProduto.total,
    total_categoria: totCategoria.total,
    itens_em_estoque: itensEstoque.total,
    valor_total_estoque: Number(valorEstoque.total),
    produto_abaixo_minimo: abaixoMinimo
  };
}
 
module.exports = { listar, buscarPorId, criar, excluir, resumo }