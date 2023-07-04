const { Router } = require('express');
const { validarArchivos , validarJWT, validarCampos } = require('../middlewares');
const {uploadFiles} = require("../controllers/upload.controller");
const { check } = require('express-validator');
const { validateExistingFolder } = require('../helpers');

const router = Router();

router.post('/:id' ,[ 
    validarJWT ,
    check('id' , 'el id no es valido').isMongoId(),
    check('id').custom(validateExistingFolder),
    validarCampos,
    validarArchivos
], uploadFiles);



module.exports = router;