const {Router} = require('express');
const { check } = require('express-validator');
const { login, loginWithGoogle , loginWithGithub} = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/validarCampos');

const router = Router();

router.post('/login',[
    check('correo' , 'El correo es obligatorio').isEmail(),
    check('password' , 'El password es obligatorio').notEmpty(),
    validarCampos
], login);


//TODO : Implementar login con google
router.post('/google' ,[
    check('nombre' , 'El campo de nombre no debe de estar vacio').notEmpty(),
    check('nombre' , 'El nombre debe de ser un string').isString(),
    check('correo' , 'el correo no es valido , por favor veriquelo').isEmail(),
    validarCampos
] ,loginWithGoogle)

router.post('/github' ,[
    check('nombre' , 'El campo de nombre no debe de estar vacio').notEmpty(),
    check('nombre' , 'El nombre debe de ser un string').isString(),
    check('correo' , 'el correo no es valido , por favor veriquelo').isEmail(),
    validarCampos
] ,loginWithGithub)


module.exports = router;