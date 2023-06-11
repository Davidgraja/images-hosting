const {Router} = require('express');
const {check} = require('express-validator');
const { login, googleSingIn } = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/validarCampos');

const router = Router();

router.post('/login',[
    check('correo' , 'El correo es obligatorio').isEmail(),
    check('password' , 'El password es obligatorio').notEmpty(),
    validarCampos
], login);

//router.post('/google',[
//    check('id_token' , 'El id Token de goggle es necesario').notEmpty(),
//    validarCampos
//], googleSingIn);

module.exports = router;