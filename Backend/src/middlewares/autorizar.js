// Middleware de autorizacao por perfil.
// Verifica se o usuario autenticado possui permissao
// para acessar determinada funcionalidade.

function autorizar(...tiposPermitidos) {
  return (req, res, next) => {

    // Verifica se o usuario foi autenticado.
    if (!req.usuario) {
      return res.status(401).json({
        erro: 'Usuario nao autenticado.'
      });
    }

    // Verifica se o perfil possui permissao.
    if (!tiposPermitidos.includes(req.usuario.tipo)) {
      return res.status(403).json({
        erro: 'Você não possui permissao para esta operacao.'
      });
    }

    next();
  };
}

module.exports = autorizar;

