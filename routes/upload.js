const { Router } = require('express');
const { validarArchivos , validarJWT } = require('../middlewares');
const {uploadFiles , deleteImage , getFiles , deleteFolder} = require("../controllers/upload.controller");

const router = Router();

router.get('/:fileName/:folder' , [
    validarJWT    
] , getFiles );

router.post('/' ,[ validarJWT , validarArchivos ], uploadFiles);

router.delete('/:folderName' ,[ validarJWT] , deleteFolder);

router.delete('/:fileName/:folder' , [ 
    validarJWT ,
],  deleteImage);


module.exports = router;