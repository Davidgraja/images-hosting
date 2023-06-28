const fs = require('fs')
const path = require('path');

const { request, response } = require('express');
const FolderModel = require('../models/folder');

const createFolder = async ( req = request , res = response ) => {

    const {_id : uid} = req.authenticatedUser;
        
    const { folderName } = req.query;

    if(folderName === 'profile'){
        return res.status(400).json({
            ok : false ,
            msg : 'Este nombre no es permitido , por favor intente con otro nombre'
        });     
    }

    try {

        const folderValidation =  await FolderModel.findOne({nombre:folderName})
    
        if(folderValidation){
            return res.status(400).json({
                ok : false ,
                msg : 'ya existe una carpeta con el mismo nombre , por favor intente con otro nombre'
            })
        }

        const newFolder = new FolderModel({imagenes: [] ,usuario : uid , nombre : folderName}); 
    
        await newFolder.save();

        const folderPath = path.join(__dirname , '../uploads' , uid.toString() , folderName)
        
        fs.mkdirSync(folderPath)

        res.json({
            ok : true,
            msg : 'Carpeta creada con exito',
            information : newFolder 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            ok : false,
            msg : 'A ocurrido un error , intentelo de nuevo o comuniquese con el administrador'
        })
    }

}

module.exports = {
    createFolder
}