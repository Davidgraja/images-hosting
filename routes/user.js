const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT , validarCampos, validarArchivos } =  require('../middlewares');

const {usuariosGet , usuariosPut , usuariosPost , usuariosDelete , updatePhotoProfile , getPhotoProfile} = require("../controllers/user.controller");
const { validateExistingEmail } = require('../helpers/db_validations');

const router = Router();

router.get('/' ,  usuariosGet  );


router.get('/photo' , validarJWT , getPhotoProfile  );


router.patch('/' , [
    validarJWT ,
    validarArchivos
] , updatePhotoProfile );


router.put('/' ,[
    validarJWT,
], usuariosPut );


router.post('/' ,[
    check('correo' , 'el correo no es valido').isEmail(),
    check('nombre' , 'el nombre es obligatorio y con un minimo de 4 digitos').notEmpty().isLength({min:4}),
    check('password' , 'el password debe de ser mayor de 6 digitos').isLength({min:6}),    
    check('correo').custom( validateExistingEmail ),
    validarCampos
] , usuariosPost );


router.delete('/', [
    validarJWT,
], usuariosDelete );

module.exports = router;