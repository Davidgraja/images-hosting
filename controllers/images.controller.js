const path = require('path');
const fs = require('fs');

const FolderModel = require('../models/folder');

const getFiles = async (req = request , res = response ) => {
    const { fileName , folderId} = req.params;

    const {_id : uid} = req.authenticatedUser;

    const folder = await FolderModel.findById(folderId);

    // ! codigo repetido
    const filePath = path.join( __dirname , '../uploads' , uid.toString() , folder.nombre , fileName  )
    
    if( !fs.existsSync(filePath) ){
        return res.status(404).json({
            ok : false ,
            msg : 'El archivo no ha sido encontrado'
        })
    }

    res.sendFile( filePath );
}


const deleteImage =  async  (req = request, res = response) => {
    
    const { fileName, folderId } = req.params; 
    
    const {_id : uid} = req.authenticatedUser;

    const folder = await FolderModel.findById(folderId);

    
    // ! codigo repetido

    const filePath  = path.join( __dirname , '../uploads' , uid.toString(), folder.nombre , fileName );
    
    if( !fs.existsSync( filePath ) ){
        return res.status(404).json({
            ok : false ,
            msg : 'El archivo no ha sido encontrado'
        })
    }

    try {

        fs.unlinkSync( filePath );

        folder.imagenes = folder.imagenes.filter( img =>  img !== fileName );
        
        await folder.save();

        res.json({
            ok : true,
            msg : 'Archivo eliminado'
        })   


    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            ok : false,
            msg : 'Ah ocurrido un error , por favor intentelo de nuevo o comuniquese con el administrador'
        })
    }
}


module.exports = {
    getFiles,
    deleteImage
}