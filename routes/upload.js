const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');
const {uploadFiles , deleteImage} = require("../controllers/upload.controller");
const {validarJWT} = require("../middlewares/validar-jwt");

const router = Router();

router.post('/' ,[ validarJWT ], uploadFiles);

router.delete('/:fileName/:folder' , [ 
    validarJWT ,
],  deleteImage);

//router.put('/:collection/:id' , updateImage );

module.exports = router;