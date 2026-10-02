// Rotas de Produto (protegidas por token).
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/produtoController');
const autenticar = require('../middlewares/auth');
 
router.use(autenticar);
 
router.get('/', ctrl.listar);
router.get('/:id', ctrl.buscar);
router.post('/', ctrl.criar);
router.put('/:id', ctrl.atualizar);
router.delete('/:id', ctrl.excluir);
 
module.exports = router;
