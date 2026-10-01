// Controller da entidade Categoria (CRUD completo).
const service = require('../services/categoriaService');
 
async function listar(req, res, next) {
  try { res.json(await service.listar()); }
  catch (e) { next(e); }
}
 
async function buscar(req, res, next) {
  try { res.json(await service.buscar(req.params.id)); }
  catch (e) { next(e); }
}
 
async function criar(req, res, next) {
  try {
    const nova = await service.criar(req.body);
    res.status(201).json(nova);
  } catch (e) { next(e); }
}
 
async function atualizar(req, res, next) {
  try { res.json(await service.atualizar(req.params.id, req.body)); }
  catch (e) { next(e); }
}
 
async function excluir(req, res, next) {
  try {
    await service.excluir(req.params.id);
    res.status(204).send();
  } catch (e) { next(e); }
}
 
module.exports = { listar, buscar, criar, atualizar, excluir };
