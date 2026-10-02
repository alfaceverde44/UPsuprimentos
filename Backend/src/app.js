// Configuracao da aplicacao Express (middlewares e rotas).
// Separado do server.js para facilitar testes.
const express = require('express');
const cors = require('cors');
 
const authRoutes = require('./routes/authRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const movimentacaoRoutes = require('./routes/movimentacaoRoutes');
const errorHandler = require('./middlewares/errorHandler');
 
const app = express();
 
app.use(cors());            // libera o consumo pelo front-end/app
app.use(express.json());    // interpreta o corpo das requisicoes em JSON
 
// Rota simples para verificar se a API esta no ar
app.get('/', (req, res) => {
  res.json({ mensagem: 'API de Controle de Estoque no ar!' });
});
 
// Registro das rotas por recurso
app.use('/auth', authRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/produtos', produtoRoutes);
app.use('/movimentacoes', movimentacaoRoutes);
 
// Rota nao encontrada (404)
app.use((req, res) => {
  res.status(404).json({ erro: 'Recurso nao encontrado.' });
});
 
// Tratamento central de erros (sempre por ultimo)
app.use(errorHandler);
 
module.exports = app;