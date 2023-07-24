const fs = require('fs');
const path = require('path');

const { rimraf } = require('rimraf');
const { request, response } = require('express');

const FolderModel = require('../models/folder');
const isValidObjectId = require('../helpers/isValidObjectId');

const getFolder =  async ( req = request , res = response ) => {

    const {_id : uid} = req.authenticatedUser;

    const {nombre , id} = req.query;

    if(id){
        const validatingId = isValidObjectId(id);

        if(!validatingId){
            return res.status(400).json({
                ok : false ,
                msg : 'El id enviado no valido'
            }) 
        }

        
        const folder = await FolderModel.findById(id).populate('usuario' , 'nombre correo');

        if(!folder){
            return res.status(404).json({
                ok : false,
                msg : `No ha sido  encontrada la carpeta  con el identificador ${id}`
            })
        }

        return  res.json({
            ok : true,
            folder
        })
    }

    if(nombre){

        const regex = new RegExp(nombre , 'i');

        const folder = await FolderModel.findOne({nombre : regex , $and:[{ usuario:uid }]}).populate('usuario' , 'nombre correo')
        
        if(!folder){
            return res.status(404).json({
                ok : false,
                msg : `No ha sido  encontrada la carpeta  con el nombre ${nombre}`
            })
        }
        return res.json({
            ok: true,
            folder
        })
    }

    res.status(400).json({
        ok : false,
        msg : 'por favor envie por medio de un query la manera que  desea buscar su carpeta , es posible realizar la busqueda ya sea por nombre o id'
    });

}

const getFolders = async ( req = request , res = response ) => {

    const {_id : uid} = req.authenticatedUser;

    try {

        const folders = await FolderModel.find({usuario : uid}).populate('usuario' , 'nombre correo')

        res.json({
            ok : true,
            folders
        })

        
    } catch (e) {
        console.log(e);
        res.status(500).json({
            ok : false ,
            msg : 'A ocurrido un error , intentelo de nuevo o comuniquese con el administrador'
        })
    }


}


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

        const folderValidation =  await FolderModel.findOne({nombre:folderName});
    
        if(folderValidation){
            return res.status(400).json({
                ok : false ,
                msg : 'ya existe una carpeta con el mismo nombre , por favor intente con otro nombre'
            });
        }

        const newFolder = new FolderModel({imagenes: [] ,usuario : uid , nombre : folderName}); 
    
        await newFolder.save();

        await newFolder.populate('usuario' , 'nombre correo')
       
        const folderPath = path.join(__dirname , '../uploads' , uid.toString() , folderName);
        
        fs.mkdirSync(folderPath);

        res.json({
            ok : true,
            msg : 'Carpeta creada con exito',
            folder : newFolder 
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            ok : false,
            msg : 'A ocurrido un error , intentelo de nuevo o comuniquese con el administrador'
        });
    }

}


const updateFolder = async ( req = request , res = response ) => {
    const { id } = req.params;
    const {nombre} = req.body;

    const {_id : uid} = req.authenticatedUser;

    const validatingFolder = await FolderModel.findById(id);

    if(nombre){

        const folderOldPath = path.join(__dirname, '../uploads' , uid.toString() , validatingFolder.nombre )
        const folderNewPath = path.join(__dirname, '../uploads' , uid.toString() , nombre)
        
        try {
            
            validatingFolder.nombre = nombre;
            await validatingFolder.save();

            fs.renameSync( folderOldPath , folderNewPath);
            
            return res.json({
                ok : true,
                msg : 'Nombre actualizado'
            })
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                ok : false,
                msg : 'A ocurrido un error , intentelo de nuevo o comuniquese con el administrador'
            })
        }

    }
    
    res.json('solo es posible actualizar el nombre en este enpoint , verique el campo enviado e intentelo de nuevo');
    
    
}

const deleteFolder = async ( req = request , res = response ) => {

    const {id} = req.params;

    const {_id : uid} = req.authenticatedUser;

    const validatingFolder = await FolderModel.findById(id);

    const folderPath = path.join( __dirname , '../uploads' , uid.toString() , validatingFolder.nombre );

    try {

        await FolderModel.findByIdAndDelete(id);
        await rimraf(folderPath);

        res.json({
            ok : true,
            msg: 'carpeta eliminada'
        })

        
    } catch (error) {

        console.log(e)
        
        return res.status(500).json({
            ok: false,
            msg : 'ha ocurrido un error , intentelo de nuevo o hable con el administrador'
        })
    }

}

module.exports = {
    getFolder,
    getFolders,
    createFolder,
    updateFolder,
    deleteFolder
}