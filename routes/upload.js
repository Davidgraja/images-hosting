const { Router } = require('express');
const { validarArchivos , validarJWT, validarCampos } = require('../middlewares');
const {uploadFiles , deleteImage , getFiles ,} = require("../controllers/upload.controller");
const { check } = require('express-validator');
const { validateExistingFolder } = require('../helpers');

const router = Router();

router.get('/:fileName/:folder' , [
    validarJWT    
] , getFiles );

router.post('/:id' ,[ 
    validarJWT ,
    check('id' , 'el id no es valido').isMongoId(),
    check('id').custom(validateExistingFolder),
    validarCampos,
    validarArchivos
], uploadFiles);


router.delete('/:fileName/:folder' , [ 
    validarJWT ,
],  deleteImage);


module.exports = router;