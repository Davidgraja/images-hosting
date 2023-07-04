const { Router } = require('express');
const { getFiles , deleteImage } = require('../controllers/images.controller');
const { validarJWT, validarCampos } = require('../middlewares');
const { check } = require('express-validator');
const { validateExistingFolder } = require('../helpers');

const router = Router();

router.get('/:folderId/:fileName', [
    validarJWT ,
    check( 'folderId' , 'Id no valido' ).isMongoId(),
    check('folderId').custom( validateExistingFolder),
    validarCampos
], getFiles );

router.delete('/:folderId/:fileName', [
    validarJWT ,
    check( 'folderId' , 'Id no valido' ).isMongoId(),
    check('folderId').custom( validateExistingFolder),
    validarCampos
] , deleteImage);

module.exports = router;