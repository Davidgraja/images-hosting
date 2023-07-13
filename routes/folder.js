const { Router } = require('express')
const { createFolder, updateFolder ,deleteFolder , getFolders , getFolder} = require('../controllers/folder.controller');
const { validarJWT, validarCampos , validateFolder} = require('../middlewares');
const { check } = require('express-validator');

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
    validarCampos,
    validateFolder
], updateFolder);

router.delete('/:id' , [
    validarJWT,
    check('id' , 'el id no es valido , por favor verifiquelo e intentelo de nuevo').isMongoId(),
    validarCampos,
    validateFolder
], deleteFolder)

module.exports= router
