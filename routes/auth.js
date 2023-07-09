const {Router} = require('express');
const { check } = require('express-validator');
const { login, loginWithGoogle} = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/validarCampos');

const router = Router();

router.post('/login',[
    check('correo' , 'El correo es obligatorio').isEmail(),
    check('password' , 'El password es obligatorio').notEmpty(),
    validarCampos
], login);


//TODO : Implementar login con google
router.post('/google' , [
    check('nombre' , 'Es obligatorio enviar un nombre').notEmpty(),
    check('correo' , 'el correo no es valido , por favor veriquelo').isEmail(),
    validarCampos
] ,loginWithGoogle)

module.exports = router;