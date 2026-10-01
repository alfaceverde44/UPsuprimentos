// Rotas de autenticacao (publicas).
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');
 
router.post('/registrar', ctrl.registrar);
router.post('/login', ctrl.login);
 
module.exports = router;