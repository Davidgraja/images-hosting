const { Router } = require('express');
const { validarArchivos , validarJWT } = require('../middlewares');
const {uploadFiles , deleteImage , getFiles} = require("../controllers/upload.controller");

const router = Router();

router.get('/:fileName/:folder' , [
    validarJWT    
] , getFiles );

router.post('/' ,[ validarJWT , validarArchivos ], uploadFiles);

router.delete('/:fileName/:folder' , [ 
    validarJWT ,
],  deleteImage);

module.exports = router;