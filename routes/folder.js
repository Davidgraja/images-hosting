const { Router } = require('express')
const { createFolder} = require('../controllers/folder.controller');
const { validarJWT, validarCampos } = require('../middlewares');
const { check } = require('express-validator');


const router = Router();

router.post('/' ,[
    validarJWT,
    check('folderName', 'Es necesario añadir un nombre para su carpeta').notEmpty(),
    validarCampos
] , createFolder )

module.exports= router
