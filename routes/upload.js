const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');
const {uploadFiles , updateImage} = require("../controllers/upload.controller");
const {validarJWT} = require("../middlewares/validar-jwt");

const router = Router();

router.post('/' ,[
    validarJWT
], uploadFiles);

//router.put('/:collection/:id' , updateImage );

module.exports = router;