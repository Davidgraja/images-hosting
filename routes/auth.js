const {Router} = require('express');
const { check } = require('express-validator');
const { login} = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/validarCampos');

const router = Router();

router.post('/login',[
    check('correo' , 'El correo no es valido , por favor veriquelo').isEmail(),
    check('password' , 'es obligatorio añadir una contraseña').notEmpty(),
    validarCampos
], login);

//Todo : implementar la renovacion de token

module.exports = router;