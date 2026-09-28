// Regras da entidade Produto.
const produtoModel = require('../models/produtoModel');
const categoriaModel = require('../models/categoriaModel');
 
async function validar(dados) {
  const { nome, preco, quantidade, marca, estoque_minimo, ID_categoria } = dados;
 
  if (!nome || nome.trim().length < 2) {
    lancar('O nome do produto e obrigatorio (min. 2 letras).');
  }
  if (preco == null || isNaN(preco) || Number(preco) < 0) {
    lancar('Preco invalido.');
  }
  if (quantidade == null || isNaN(quantidade) || Number(quantidade) < 0) {
    lancar('Quantidade invalida.');
  }
  if (!marca || marca.trim().length < 2) {
     lancar('A marca do produto e obrigatoria.');
  }

  if (estoque_minimo == null || isNaN(estoque_minimo) || Number(estoque_minimo) < 0) {
    lancar('Estoque minimo invalido.');
  }
  if (!ID_categoria) {
    lancar('Selecione uma categoria.');
  }
  const cat = await categoriaModel.buscarPorId(ID_categoria);
  if (!cat) {
    lancar('Categoria informada nao existe.');
  }
}
 
function lancar(msg) {
  const erro = new Error(msg);
  erro.status = 400;
  throw erro;
}
 
async function listar() {
  return produtoModel.listar();
}
 
async function buscar(id) {
  const p = await produtoModel.buscarPorId(id);
  if (!p) {
    const erro = new Error('Produto nao encontrado.');
    erro.status = 404;
    throw erro;
  }
  return p;
}
 
async function criar(dados) {
  await validar(dados);
  return produtoModel.criar(dados);
}
 
async function atualizar(id, dados) {
  await buscar(id);
  await validar(dados);
  return produtoModel.atualizar(id, dados);
}
 
async function excluir(id) {
  await buscar(id);
  return produtoModel.excluir(id);
}
 
module.exports = { listar, buscar, criar, atualizar, excluir };
