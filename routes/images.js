const { Router } = require('express');
const { getFiles , deleteImage, uploadFiles , updateFile} = require('../controllers/images.controller');
const { validarJWT, validarCampos, validateFile, validarArchivos } = require('../middlewares');
const { check } = require('express-validator');
const { validateExistingFolder } = require('../helpers');

const router = Router();

router.get('/:folderId/:fileName', [
    validarJWT ,
    check( 'folderId' , 'Id no valido' ).isMongoId(),
    check('folderId').custom( validateExistingFolder),
    validarCampos,
    validateFile,
], getFiles );


router.post('/:id' ,[ 
    validarJWT ,
    check('id' , 'el id no es valido').isMongoId(),
    check('id').custom(validateExistingFolder),
    validarCampos,
    validarArchivos
], uploadFiles);


router.put('/:folderId/:fileName' , [
    validarJWT,
    check( 'folderId' , 'Id no valido' ).isMongoId(),
    check('folderId').custom( validateExistingFolder),
    validarCampos,
    validateFile,
    validarArchivos
] , updateFile )

router.delete('/:folderId/:fileName', [
    validarJWT ,
    check( 'folderId' , 'Id no valido' ).isMongoId(),
    check('folderId').custom( validateExistingFolder),
    validarCampos,
    validateFile,
] , deleteImage);

module.exports = router;