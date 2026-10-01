// Middleware central de tratamento de erros.
// Garante que a API nunca "quebre" devolvendo stack trace ao cliente:
// sempre responde um JSON com mensagem e status adequados.
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const mensagem = status === 500
    ? 'Erro interno no servidor.'
    : err.message;
 
  // Loga o erro completo no console (para o desenvolvedor ver).
  if (status === 500) console.error(err);
 
  res.status(status).json({ erro: mensagem });
}
 
module.exports = errorHandler;