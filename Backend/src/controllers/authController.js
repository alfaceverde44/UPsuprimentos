// Controller de autenticacao. Recebe a requisicao, chama o service
// e devolve a resposta. Erros sao repassados ao errorHandler via next().
const authService = require('../services/authService');
 
async function registrar(req, res, next) {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios.' });
    }
    if (senha.length < 6) {
      return res.status(400).json({ erro: 'A senha deve ter ao menos 6 caracteres.' });
    }
    const usuario = await authService.registrar({ nome, email, senha });
    res.status(201).json(usuario);
  } catch (e) {
    next(e);
  }
}
 
async function login(req, res, next) {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) {
      return res.status(400).json({ erro: 'Informe e-mail e senha.' });
    }
    const resultado = await authService.login({ email, senha });
    res.json(resultado);
  } catch (e) {
    next(e);
  }
}
 
module.exports = { registrar, login };