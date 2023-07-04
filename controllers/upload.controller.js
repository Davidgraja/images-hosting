const { request , response} = require('express');

const FolderModel = require('../models/folder')

const {uploadFile} = require('../helpers');


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

module.exports = {
    uploadFiles    
}