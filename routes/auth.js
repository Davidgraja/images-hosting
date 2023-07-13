const {Router} = require('express');
const { check } = require('express-validator');
const { login, loginWithGoogle , loginWithGithub , loginWithProviders} = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/validarCampos');

const router = Router();

router.post('/login',[
    check('correo' , 'El correo no es valido , por favor veriquelo').isEmail(),
    validarCampos
], login);


router.post('/providers' ,[
    check('nombre' , 'El campo de nombre no debe de estar vacio').notEmpty(),
    check('nombre' , 'El nombre debe de ser un string').isString(),
    check('correo' , 'El correo no es valido , por favor veriquelo').isEmail(),
    check('provider' , 'El Provider debe de ser de tipo string').isString(),
    check('provider' , 'Es necesario enviar el provedor de autenticación').notEmpty(),
    validarCampos
] ,loginWithProviders)


module.exports = router;