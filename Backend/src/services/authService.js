// Regras de autenticacao: cadastro e login.
// Aqui a senha e criptografada (bcrypt) e o token JWT e gerado.
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');
 
async function registrar({ nome, email, senha }) {
  const jaExiste = await usuarioModel.buscarPorEmail(email);
  if (jaExiste) {
    const erro = new Error('Ja existe um usuario com este e-mail.');
    erro.status = 400;
    throw erro;
  }
  // Gera o hash da senha
  const senha_hash = await bcrypt.hash(senha, 10);
  const usuario = await usuarioModel.criar({ nome, email, senha_hash });
  return usuario;
}
 
async function login({ email, senha }) {
  const usuario = await usuarioModel.buscarPorEmail(email);
  if (!usuario) {
    const erro = new Error('E-mail ou senha invalidos.');
    erro.status = 401;
    throw erro;
  }
  // Compara a senha digitada com o hash guardado.
  const senhaConfere = await bcrypt.compare(senha, usuario.senha_hash);
  if (!senhaConfere) {
    const erro = new Error('E-mail ou senha invalidos.');
    erro.status = 401;
    throw erro;
  }
  // Gera o token JWT com os dados basicos do usuario.
  const token = jwt.sign(
    { ID_usuario: usuario.ID_usuario, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
  return {
    token,
    usuario: { ID_usuario: usuario.ID_usuario, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo}
  };
}
 
module.exports = { registrar, login };
