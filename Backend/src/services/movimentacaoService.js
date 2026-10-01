// Regras da entidade Movimentacao.
// Ao registrar uma ENTRADA ou SAIDA, o saldo do produto e atualizado.
const movModel = require('../models/movimentacaoModel');
const produtoModel = require('../models/produtoModel');
 
async function listar() {
  return movModel.listar();
}
 
async function resumoDashboard() {
  return movModel.resumo();
}
 
async function criar({ ID_produto, ID_usuario, tipo, quantidade, descricao}) {
  tipo = String(tipo || '').toUpperCase();
  quantidade = Number(quantidade);
 
  if (!ID_produto) lancar('Selecione um produto.');
  if (tipo !== 'ENTRADA' && tipo !== 'SAIDA') lancar('Tipo deve ser ENTRADA ou SAIDA.');
  if (!Number.isInteger(quantidade) || quantidade <= 0) 
  { lancar('Quantidade deve ser um numero inteiro maior que zero.');
}

 
  const produto = await produtoModel.buscarPorId(ID_produto);
  if (!produto) lancar('Produto nao encontrado.', 404);
 
  // Calcula o novo saldo
  let novoSaldo = Number(produto.quantidade);
  if (tipo === 'ENTRADA') {
    novoSaldo += quantidade;
  } else {
    if (quantidade > produto.quantidade) {
      lancar('Saida maior que o estoque disponivel (' + produto.quantidade + ').');
    }
    novoSaldo -= quantidade;
  }
 
  // Registra a movimentacao e atualiza o saldo do produto
  const mov = await movModel.criar({ ID_produto, ID_usuario, tipo, quantidade, descricao });
  await produtoModel.atualizarQuantidade(ID_produto, novoSaldo);
  return mov;
}
 
async function excluir(id) {
  const mov = await movModel.buscarPorId(id);
  if (!mov) lancar('Movimentacao nao encontrada.', 404);
  return movModel.excluir(id);
}
 
function lancar(msg, status = 400) {
  const erro = new Error(msg);
  erro.status = status;
  throw erro;
}
 
module.exports = { listar, criar, excluir, resumoDashboard };
