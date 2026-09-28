// Regras da entidade Categoria
const categoriaModel = require('../models/categoriaModel');
 
function validar({ nome }) {
  if (!nome || nome.trim().length < 2) {
    const erro = new Error('O nome da categoria e obrigatorio (min. 2 letras).');
    erro.status = 400;
    throw erro;
  }
}
 
async function listar() {
  return categoriaModel.listar();
}
 
async function buscar(id) {
  const cat = await categoriaModel.buscarPorId(id);
  if (!cat) {
    const erro = new Error('Categoria nao encontrada.');
    erro.status = 404;
    throw erro;
  }
  return cat;
}
 
async function criar(dados) {
  validar(dados);
  return categoriaModel.criar(dados);
}
 
async function atualizar(id, dados) {
  await buscar(id); // garante que existe
  validar(dados);
  return categoriaModel.atualizar(id, dados);
}
 
async function excluir(id) {
  await buscar(id);
  try {
    return await categoriaModel.excluir(id);
  } catch (e) {
    // Categoria em uso por algum produto (FK RESTRICT)
    const erro = new Error('Nao e possivel excluir: ha produtos nesta categoria.');
    erro.status = 400;
    throw erro;
  }
}
 
module.exports = { listar, buscar, criar, atualizar, excluir };
