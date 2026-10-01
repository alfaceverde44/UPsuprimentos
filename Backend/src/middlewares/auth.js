// Middleware de autenticacao.
// Le o cabecalho "Authorization: Bearer <token>", valida o JWT e,
// se estiver ok, coloca os dados do usuario em req.usuario.
const jwt = require('jsonwebtoken');
 
function autenticar(req, res, next) {
  const cabecalho = req.headers.authorization || '';
  const [tipo, token] = cabecalho.split(' ');
 
  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ erro: 'Token nao enviado.' });
  }
 
  try {
    const dados = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = dados; // { ID_usuario, nome, email, tipo }
    next();
  } catch (e) {
    return res.status(401).json({ erro: 'Token invalido ou expirado.' });
  }
}
 
module.exports = autenticar;