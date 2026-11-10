const router = require('express').Router();
const { rateLimit } = require('express-rate-limit');
const { registrar, login, perfil } = require('../controllers/auth.controller');
const { registerValidator, loginValidator } = require('../validators/auth.validator');
const validar = require('../middlewares/validate.middleware');
const validarToken = require('../middlewares/auth.middleware');
const limite = rateLimit({ windowMs: 15 * 60 * 1000, limit: 60, standardHeaders: 'draft-8', legacyHeaders: false,
    message: { msg: 'Demasiados intentos. Espera unos minutos antes de continuar' } });
router.post('/registrar', limite, registerValidator, validar, registrar);
router.post('/login', limite, loginValidator, validar, login);
router.get('/perfil', validarToken, perfil);
module.exports = router;
