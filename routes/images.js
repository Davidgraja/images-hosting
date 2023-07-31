const { Router } = require('express');
const { getFiles , deleteImage, uploadFiles , updateFile} = require('../controllers/images.controller');
const { validarJWT, validarCampos, validateFile, validarArchivos , validateFolder } = require('../middlewares');
const { check } = require('express-validator');

const router = Router();

router.get('/:folderId/:fileName', [
    validarJWT ,
    check( 'folderId' , 'Id no valido' ).isMongoId(),
    validarCampos,
    validateFile,
], getFiles );


router.post('/:id' ,[ 
    validarJWT ,
    check('id' , 'el id no es valido').isMongoId(),
    validarCampos,
    validarArchivos,
    validateFolder
], uploadFiles);


router.put('/:folderId/:fileName' , [
    validarJWT,
    check( 'folderId' , 'Id no valido' ).isMongoId(),
    validarCampos,
    validateFile,
    validarArchivos
] , updateFile )

router.delete('/:folderId/:fileName', [
    validarJWT ,
    check( 'folderId' , 'Id no valido' ).isMongoId(),
    validarCampos,
    validateFile,
] , deleteImage);

module.exports = router;