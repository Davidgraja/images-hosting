const fs = require('fs');

const { request , response } = require('express');

const FolderModel = require('../models/folder');
const {uploadFile} = require("../helpers");

const getFiles = async (req = request , res = response ) => {
    res.sendFile( req.filePath );
}

const uploadFiles = async  ( req = request , res = response) => {

    const {_id : uid} = req.authenticatedUser;

    const {id} = req.params;

    try {
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

const updateFile = async ( req = request , res = response ) => {
    const { folderId , fileName } = req.params;
    
    const {_id : uid} = req.authenticatedUser;
    
    try {
    
        const folder = await FolderModel.findById(folderId);
        
        const fileIndex = folder.imagenes.indexOf(fileName);
        
        const newfile  = await uploadFile(req.files , undefined , uid.toString() , folder.nombre );
        
        folder.imagenes.splice(fileIndex , 1 , newfile)
        await folder.save()
        
        fs.unlinkSync( req.filePath );
        
        res.json({
            ok : true ,
            msg : 'imagen actualizada'
        })
        
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            ok : false,
            msg : 'Ah ocurrido un error , intentelo de nuevo o hable con el administrador'
        })
    }
}
const deleteImage =  async  (req = request, res = response) => {
    
    const { fileName, folderId } = req.params; 

    const folder = await FolderModel.findById(folderId);

    try {

        fs.unlinkSync( req.filePath );

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
    uploadFiles,
    updateFile,
    deleteImage
}