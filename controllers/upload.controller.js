const path = require('path');
const fs = require('fs');

const { request , response} = require('express');

const Usuario = require('../models/usuario')

const {uploadFile} = require('../helpers');

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
        
    const { folder = 'images' } = req.query;
    
    if(folder === 'profile' || folder === 'perfil'){
        return res.status(400).json({
            ok : false ,
            message : 'Nombre no permitido , porfavor intente con otro nombre'
        })
        
    }

    try {
        const user = await Usuario.findById(uid);

        const { nameTemporary } = await uploadFile(req.files , undefined , uid.toString() , folder );
        user.images = [ ...user.images , nameTemporary ]; 

        await user.save()

        res.json({
            ok : true,
            filename : nameTemporary
        })
        
    } catch (message) {
        res.status(400).json({
            ok : false,
            message 
        })
    }
}


const deleteImage =  async  (req = request, res = response) => {
    
    const { fileName, folder } = req.params; 
    
    const {_id : uid} = req.authenticatedUser;

    if( folder === 'profile'){
        return res.status(400).json({
            ok : false ,
            message : 'no es posible eliminar esta carpeta desde el actual enpoint. por intentelo desde un metodo de actualización para usuarios '
        })
    }

    
    const user = await Usuario.findById(uid);
    
    const filePath  = path.join( __dirname , '../uploads' , uid.toString(), folder , fileName );
    const folderPath  = path.join( __dirname , '../uploads' , uid.toString(), folder )
    
    if( !fs.existsSync( filePath ) ){
        return res.status(404).json({
            ok : false ,
            menssage : 'El archivo no ha sido encontrado'
        })
    }

    try {
        
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

    // res.json(result.length)
}

module.exports = {
    getFiles,
    uploadFiles,
    deleteImage
}