// Regras da entidade Movimentacao.
// Ao registrar uma ENTRADA ou SAIDA, o saldo do produto e atualizado.
const movModel = require('../models/movimentacaoModel');
const pool = require('../config/db');
// Lista todas as movimentacoes registradas
async function listar() {
  return movModel.listar();
}
// Retorna os dados utilizados pela dashboard
async function resumoDashboard() {
  return movModel.resumo();
}

// Registra uma entrada ou saida e atualiza o estoque
async function criar({ ID_produto, ID_usuario, tipo, quantidade, descricao }) {
  tipo = String(tipo || '').toUpperCase();
  quantidade = Number(quantidade);

  // Valida os dados recebidos
  if (!ID_produto) {
    lancar('Selecione um produto.');
  }
  if (tipo !== 'ENTRADA' && tipo !== 'SAIDA') {
    lancar('Tipo deve ser ENTRADA ou SAIDA.');
  }
  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    lancar('Quantidade deve ser um numero inteiro maior que zero.');
  }
  // Reserva uma conexao do pool
  const conexao = await pool.getConnection();
  // Guarda o ID para consultar a movimentacao depois da transacao
  let ID_movimentacao;
  try {
    // Inicia a transacao no banco de dados
    await conexao.beginTransaction();
    // Busca e bloqueia o produto durante a transacao
    // FOR UPDATE impede alteracoes simultaneas no mesmo registro
    const [linhas] = await conexao.query(
      'SELECT * FROM produto WHERE ID_produto = ? FOR UPDATE',
      [ID_produto]
    );

    const produto = linhas[0];
    // Verifica se o produto existe
    if (!produto) {
      lancar('Produto nao encontrado.', 404);
    }
    // Pega a quantidade atual do produto
    let novoSaldo = Number(produto.quantidade);
    // Se for ENTRADA, adiciona a quantidade ao estoque
    if (tipo === 'ENTRADA') {

      novoSaldo += quantidade;
    } else {
      // Se for SAIDA, verifica se existe estoque suficiente
      if (quantidade > novoSaldo) {
        lancar(
          'Saida maior que o estoque disponivel (' + novoSaldo + ').'
        );
      }
      // Subtrai a quantidade retirada
      novoSaldo -= quantidade;
    }
    // Registra a movimentacao utilizando a mesma conexao
    const mov = await movModel.criar({ID_produto, ID_usuario, tipo, quantidade, descricao },
      conexao
    );

    // Guarda o ID da movimentacao cadastrada
    ID_movimentacao = mov.ID_movimentacao;
    // Atualiza a quantidade do produto na mesma transacao
    await conexao.query(
      'UPDATE produto SET quantidade = ? WHERE ID_produto = ?',
      [novoSaldo, ID_produto]
    );

    // Se tudo funcionou, confirma as alteracoes
    await conexao.commit();
  } catch (erro) {
    // Se alguma etapa falhar, desfaz as alteracoes pendentes
    await conexao.rollback();
    // Encaminha o erro para o Controller tratar
    throw erro;
  } finally {
    // Devolve a conexao ao pool, mesmo se ocorrer algum erro
    conexao.release();
  }
  // Consulta a movimentacao depois de finalizar a transacao
  return movModel.buscarPorId(ID_movimentacao);
}
// Impede a exclusao direta para preservar o historico do estoque
async function excluir(id) {

  const mov = await movModel.buscarPorId(id);

  if (!mov) {
    lancar('Movimentacao nao encontrada.', 404);
  }

  lancar(
    'Movimentacoes registradas nao podem ser excluidas. Realize uma movimentacao de estorno.',
    400
  );
}
// Funcao auxiliar para criar mensagens de erro
function lancar(msg, status = 400) {

  const erro = new Error(msg);
  erro.status = status;

  throw erro;
}
// Exporta as funcoes para serem utilizadas pelo Controller
module.exports = {listar, criar, excluir, resumoDashboard};
