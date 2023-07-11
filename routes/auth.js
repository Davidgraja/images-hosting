const {Router} = require('express');
const { check } = require('express-validator');
const { login, loginWithGoogleAndGithub} = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/validarCampos');

const router = Router();

router.post('/login',[
    check('correo' , 'El correo es obligatorio').isEmail(),
    check('password' , 'El password es obligatorio').notEmpty(),
    validarCampos
], login);


//TODO : Implementar login con google
router.post('/googleAndGithub' , [
    check('nombre' , 'El campo de nombre no debe de estar vacio').notEmpty(),
    check('nombre' , 'El nombre debe de ser un string').isString(),
    check('correo' , 'el correo no es valido , por favor veriquelo').isEmail(),
    check('provider' , 'es necesario enviar el provedor de l authenticación').notEmpty(),
    check('provider' , 'es necesario enviar el provedor de l authenticación').isString(),
    validarCampos
] ,loginWithGoogleAndGithub)

module.exports = router;