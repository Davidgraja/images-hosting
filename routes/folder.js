const { Router } = require('express')
const { createFolder, updateFolder ,deleteFolder , getFolders , getFolder} = require('../controllers/folder.controller');
const { validarJWT, validarCampos } = require('../middlewares');
const { check } = require('express-validator');
const { validateExistingFolder } = require('../helpers');


const router = Router();

router.get('/search' ,[
    validarJWT
] , getFolder );

router.get('/' , validarJWT , getFolders )

router.post('/' ,[
    validarJWT,
    check('folderName', 'Es necesario añadir un nombre para su carpeta').notEmpty(),
    validarCampos
] , createFolder );

router.patch('/:id' , [
    validarJWT,
    check('id' , 'el id no es valido , por favor verifiquelo e intentelo de nuevo').isMongoId(),
    check('id').custom(validateExistingFolder),
    validarCampos
], updateFolder);

router.delete('/:id' , [
    validarJWT,
    check('id' , 'el id no es valido , por favor verifiquelo e intentelo de nuevo').isMongoId(),
    check('id').custom(validateExistingFolder),
    validarCampos
], deleteFolder)

module.exports= router
