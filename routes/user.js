const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT , validarCampos , validarArchivos } =  require('../middlewares');

const {usuariosGet , usuariosPut , usuariosPost , usuariosDelete , updatePhotoProfile , getPhotoProfile} = require("../controllers/user.controller");
const { validateExistingEmail, validateExistingIdUser } = require('../helpers/db_validations');

const router = Router();

router.get('/' ,  usuariosGet  );


router.get('/photo' , validarJWT , getPhotoProfile  );


router.patch('/' , [
    validarJWT ,
] , updatePhotoProfile );


router.put('/:id' ,[
    validarJWT,
    check('id' , 'el id enviado no es valido').isMongoId(),
    check('id').custom( validateExistingIdUser ),
    validarCampos

], usuariosPut );


router.post('/' ,[
    check('correo' , 'el correo no es valido').isEmail(),
    check('nombre' , 'el nombre es obligatorio y con un minimo de 4 digitos').notEmpty().isLength({min:4}),
    check('password' , 'el password debe de ser mayor de 6 digitos').isLength({min:6}),    
    check('correo').custom( validateExistingEmail ),
    validarCampos
] , usuariosPost );


router.delete('/:id', [
    validarJWT,
    check('id' , 'el id enviado no es valido').isMongoId(),
    check('id').custom( validateExistingIdUser ),
    validarCampos
    
], usuariosDelete );

module.exports = router;