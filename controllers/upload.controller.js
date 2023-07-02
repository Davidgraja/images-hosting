const path = require('path');
const fs = require('fs');

const { request , response} = require('express');

const FolderModel = require('../models/folder')

const {uploadFile} = require('../helpers');

// Todo : mover a el controlador de imagenes
const getFiles = (req = request , res = response ) => {
    const { fileName , folder} = req.params;

    const {_id : uid} = req.authenticatedUser;
    
    const filePath = path.join( __dirname , '../uploads' , uid.toString() , folder , fileName  )
    
    if( !fs.existsSync(filePath) ){
        return res.status(404).json({
            ok : false ,
            message : 'El archivo no ha sido encontrado'
        })
        
    }

    res.sendFile( filePath );
}


const uploadFiles = async  ( req = request , res = response) => {

    const {_id : uid} = req.authenticatedUser;
        
    const {id} = req.params;

    try {
        // todo : reconstruir la logica de subida de archivos
        const folder = await FolderModel.findOne({_id : id ,$and: [{usuario:uid}]});

        if(!folder){
            return res.status(404).json({
                ok : false,
                msg:'No ha sido  encontrada la carpeta '
            })
        }

        const fileName  = await uploadFile(req.files , undefined , uid.toString() , folder.nombre );

        folder.imagenes = [ ...folder.imagenes , fileName ]; 

        await folder.save();

        res.json({
            ok : true,
            fileName
        })


        
    } catch (e) {
        console.log(e);

        res.status(500).json({
            ok : false,
            message : 'ha ocurrido un error , intentelo de nuevo o hable con el administrador'
        })
    }
}

// Todo : mover a el controlador de imagenes

const deleteImage =  async  (req = request, res = response) => {
    
    const { fileName, folder } = req.params; 
    
    const {_id : uid} = req.authenticatedUser;

    if( folder === 'profile'){
        return res.status(400).json({
            ok : false ,
            message : 'no es posible eliminar esta carpeta desde el actual enpoint. por intentelo desde un metodo de actualización para usuarios '
        })
    }

        
    const filePath  = path.join( __dirname , '../uploads' , uid.toString(), folder , fileName );
    const folderPath  = path.join( __dirname , '../uploads' , uid.toString(), folder )
    
    if( !fs.existsSync( filePath ) ){
        return res.status(404).json({
            ok : false ,
            menssage : 'El archivo no ha sido encontrado'
        })
    }

    try {

        const user = await Usuario.findById(uid);
        fs.unlinkSync( filePath );

        user.images = user.images.filter( img =>  img !== fileName );
        
        await user.save();
        
        const folder = fs.readdirSync(folderPath)

        if( folder.length === 0 ){
            fs.rmdirSync(folderPath);
        } 

        
        res.json({
            ok : true,
            message : 'Archivo eliminado'
        })   


    } catch (error) {
        console.log(error);
        
        res.status(404).json({
            ok : false,
            message : 'El archivo no ha sido encontrado'
        })
    }
}

module.exports = {
    getFiles,
    uploadFiles,
    deleteImage,
    
}