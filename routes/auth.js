const {Router} = require('express');
const { check } = require('express-validator');
const { login , renewToken} = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/login',[
    check('correo' , 'El correo no es valido , por favor veriquelo').isEmail(),
    check('password' , 'es obligatorio añadir una contraseña').notEmpty(),
    validarCampos
], login);


router.get('/renew' , validarJWT ,renewToken )

module.exports = router;