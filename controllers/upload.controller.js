const path = require('path');
const fs = require('fs');

const { request , response} = require('express');
const {uploadFile} = require('../helpers');

const Usuario = require('../models/usuario')

const uploadFiles = async  ( req = request , res = response) => {

        
    const {_id : uid} = req.authenticatedUser;
        
    const { folder = 'images' } = req.query;

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).json({
            ok : false ,
            message : 'No hay archivos que subir'
        });
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
    
    const user = await Usuario.findById(uid);
    
    const filePath  = path.join( __dirname , '../uploads' , uid.toString(), folder , fileName )

    if( !fs.existsSync( filePath ) ){
        return res.json({
            ok : false ,
            menssage : 'El archivo no ha sido encontrado'
        })   
    }
    
    fs.unlinkSync( filePath );

    user.images = user.images.filter( img =>  img !== fileName );
    
    await user.save();
    
    res.json({
        ok : true,
        message : 'Archivo eliminado'
    })   

}

module.exports = {
    uploadFiles,
    deleteImage
}