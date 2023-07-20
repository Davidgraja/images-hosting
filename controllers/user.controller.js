const path = require('path');
const fs = require('fs');

const { rimraf } = require('rimraf');
const bcrypt = require('bcryptjs');
const { response , request } = require('express');

const UsuarioModel = require('../models/usuario');
const FolderModel = require('../models/folder')

const {generarJWT} = require("../helpers/generar_jwt");
const {uploadFile} = require("../helpers/uploadFile");

const usuariosGet = async (req = request, res = response ) => {

    const query = { estado : true }
    
    const { limit = 0 , from = 0 } = req.query;
    
    const [total , usuarios] = await Promise.all([
        UsuarioModel.countDocuments( query ),

        UsuarioModel.find( query )
            .skip(Number(from))
            .limit( Number(limit))
    ]) 
    
    res.json(usuarios)

}

const getPhotoProfile = async  (req = request , res = response ) => {

    const {_id : uid} = req.authenticatedUser;

    const usuario = await UsuarioModel.findById(uid);
    
    const filePath = path.join( __dirname , '../uploads' , uid.toString() , 'profile', usuario.img );
    
    if(!fs.existsSync(filePath)){
        return res.status(404).json({
            ok : false ,
            msg : 'imagen no encontrada'
            
        })
    }

    res.sendFile(filePath);
}


const usuariosPut =  async (req = request, res = response ) => {

    const {_id : uid} = req.authenticatedUser;

    const { _id , images , img,  password , google ,correo, nombre, estado ,...informationUser } = req.body;

    if( password ){
        if(password.trim().length < 6){
            return res.status(406).json({
                ok : false ,
                message : 'el password debe de tener como minimo 6 caracteres'
            })
        }

        const salt = bcrypt.genSaltSync();
        informationUser.password = bcrypt.hashSync(password , salt);

    }

    if( nombre ){

        if(typeof (nombre) !== 'string'){
            return res.status(400).json({
                ok : false ,
                message : 'el nombre tiene que ser una cadena de texto'
            })
        }

        if(nombre.trim().length < 4){
            return res.status(406).json({
                ok : false ,
                message : 'el nombre debe de tener como minimo 4 caracteres'
            })
        }

        

        informationUser.nombre = nombre

    }

    if(correo){
        if( !correo.includes('@') ){
            return res.status(406).json({
                ok: false,
                message : 'el correo no es permitido , por favor verifique que este escrito correctamente e  intentelo de nuevo'
            })
        }
        
        informationUser.correo = correo
    }

    const usuario = await UsuarioModel.findByIdAndUpdate(uid , informationUser ,{new:true});

    res.json({
        "message" : "Usuario actualizado",
        ok: true,
        usuario
    })
}


const usuariosPost = async (req = request, res = response ) => {

    const {nombre , correo , password } = req.body;

    const usuario = new UsuarioModel({nombre , correo , password });

    //* encriptación  de la contraseña 

    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password , salt);

    //* Guardar en la base de datos 
    await usuario.save();


    const folderPath = path.join(__dirname , '../uploads' , usuario._id.toString());
        
    fs.mkdirSync(folderPath)

    const token = await generarJWT(usuario._id.toString());

    res.json({
        ok: true,
        msg : "Usuario creado con exito",
        usuario ,
        token
    })

}

const usuariosDelete = async (req = request, res = response ) => {

    const {_id : uid} = req.authenticatedUser;

    const folderPath =  path.join( __dirname , '../uploads' , uid.toString() );
    
    try{
        
        // * eliminando al usuario fisicamente del servidor 

        await rimraf(folderPath);
        
        //* Borrar fisicamente de la base de datos   
        await UsuarioModel.findByIdAndDelete(uid.toString());
        
        // * eliminando las carpetas de la base de datos
        const removeFolders = [];

        const folders = await FolderModel.find({usuario : uid});

        folders.forEach(item => {
            removeFolders.push(FolderModel.findByIdAndDelete(item._id))
        })

        await Promise.all(removeFolders)

        res.status(200).json({
            ok: true,
            msg : "Usuario eliminado"
        })

    }catch(e){
        console.log(e)
        return res.status(500).json({
            
            ok : false ,
            msg : 'No ha sido posible eliminar el usuario  , por favor hable con el admistrador'
        })
    }   

}

const updatePhotoProfile  = async ( req = request , res = response ) => {
    const {_id : uid} = req.authenticatedUser;

    const { remove = false } = req.query;

    const usuario = await UsuarioModel.findById(uid);

    const filePath = path.join( __dirname , '../uploads' , uid.toString() , 'profile', usuario.img );

    if(remove){

        const folderPath = path.join( __dirname , '../uploads' , uid.toString() , 'profile' );
        
        try {
        
            fs.unlinkSync(filePath)
            fs.rmdirSync(folderPath)
        
            usuario.img = '';
            await usuario.save();
            
            return res.json({
                ok : true ,
                msg : 'imagen actualizada'
            })
            
        } catch (e) {
            console.log(e)
            return res.status(404).json({
                ok : false,
                msg : 'no hay imagen para eliminar'
            })
        }
    }

    

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).json({
            ok : false ,
            msg : 'No hay archivos que subir'
        });
    } 

    
    if( usuario.img){
        
        try {
            fs.unlinkSync(filePath)
            
        }catch (e){
            console.log(e);
            
            return res.status(500).json({
                ok : false,
                msg : 'no ha sido posible eliminar el archivo  , por favor hable con el administrador'
            })
        }

    }  
    

    const nameTemporary  = await uploadFile(req.files , undefined , uid.toString() , 'profile' );
    
    usuario.img = nameTemporary;
    await usuario.save();

    res.json({
        ok : true,
        msg : 'imagen actualizada'
    })
}


    
module.exports = {
    usuariosGet,
    getPhotoProfile,
    usuariosPut,
    updatePhotoProfile,
    usuariosPost,
    usuariosDelete,
}
