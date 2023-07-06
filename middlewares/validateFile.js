const path = require('path');
const fs = require('fs');

const {  request , response } = require('express');

const FolderModel = require('../models/folder');

const validateFile = async ( req = request , res = response , next ) => {

    const { fileName , folderId} = req.params;

    const {_id : uid} = req.authenticatedUser;

    const folder = await FolderModel.findById(folderId);
    
    if(!folder){
        return res.status(404).json({
            ok : false ,
            msg : 'La carpeta no ha sido encontrada'
        });
    }
    
    const filePath = path.join( __dirname , '../uploads' , uid.toString() , folder.nombre , fileName )
    
    if( !fs.existsSync(filePath) ){
        return res.status(404).json({
            ok : false ,
            msg : 'El archivo no ha sido encontrado'
        });
    }

    req.filePath = filePath;

    next();

}

module.exports = {
    validateFile
}