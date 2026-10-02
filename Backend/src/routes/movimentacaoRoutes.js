// Rotas de Movimentacao e dashboard (protegidas por token).
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/movimentacaoController');
const autenticar = require('../middlewares/auth');
 
router.use(autenticar);
 
router.get('/dashboard', ctrl.dashboard); // resumo para a tela inicial
router.get('/', ctrl.listar);
router.post('/', ctrl.criar);
router.delete('/:id', ctrl.excluir);
 
module.exports = router;
