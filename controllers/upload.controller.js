const path = require('path');
const fs = require('fs');

const { rimraf } = require('rimraf');
const { request , response} = require('express');

const UsuarioModel = require('../models/usuario')
const FolderModel = require('../models/folder')

const {uploadFile} = require('../helpers');
const e = require('express');

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
    

    if(folder === 'profile'){
        return res.status(400).json({
            ok : false ,
            message : 'Nombre no permitido , por favor intente con otro nombre'
        })     
    }


    try {
        // todo : reconstruir la logica de subida de archivos
        // const user = await Usuario.findById(uid);
        const folderData = { imagenes : [] , usuario : uid , nombre : folder}
        const newFolder = new FolderModel( folderData)
        // const { nameTemporary } = await uploadFile(req.files , undefined , uid.toString() , folder );
        // user.images = [ ...user.images , nameTemporary ]; 

        // await user.save()

        res.json({
            ok : true,
            newFolder
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


const deleteFolder = async ( req = request , res = response ) => {

    const {folderName} = req.params;

    const {_id : uid} = req.authenticatedUser;


    const folderPath = path.join( __dirname , '../uploads' , uid.toString() , folderName );

    if(folderName === 'profile'){
        return res.status(400).json({
            ok : false,
            message : 'no es posible eliminar esta carpeta'
        })
    }
    if(!fs.existsSync(folderPath)){
        return res.status(404).json({
            ok : false,
            message : 'la carpeta no ha sido encontrada'
        })
    }

    try {

        let usuario = await Usuario.findById(uid);

        const folder = fs.readdirSync(folderPath);

        
        folder.forEach( item => {

            usuario.images = usuario.images.filter(file => file !== item);

        });


        await usuario.save();
        await rimraf(folderPath);

        res.json({
            ok : true,
            message : 'carpeta eliminada'
        })

        
    } catch (error) {

        console.log(e)
        
        return res.status(500).json({
            ok: false,
            message : 'ha ocurrido un error , intentelo de nuevo o hable con el administrador'
        })
    }
    
}

module.exports = {
    getFiles,
    uploadFiles,
    deleteImage,
    deleteFolder
}