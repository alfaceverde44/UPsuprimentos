// Rotas de Categoria (protegidas por token).
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/categoriaController');
const autenticar = require('../middlewares/auth');
 
router.use(autenticar); // todas exigem token
 
router.get('/', ctrl.listar);
router.get('/:id', ctrl.buscar);
router.post('/', ctrl.criar);
router.put('/:id', ctrl.atualizar);
router.delete('/:id', ctrl.excluir);
 
module.exports = router;


