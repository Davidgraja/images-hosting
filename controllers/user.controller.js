const path = require('path');
const fs = require('fs');

const { rimraf } = require('rimraf')
const bcrypt = require('bcryptjs');
const { response , request } = require('express');

const Usuario = require('../models/usuario');

const {generarJWT} = require("../helpers/generar_jwt");
const {uploadFile} = require("../helpers/uploadFile");

const usuariosGet = async (req = request, res = response ) => {

    const query = { estado : true }
    
    const { limit = 0 , from = 0 } = req.query;
    
    const [total , usuarios] = await Promise.all([
        Usuario.countDocuments( query ),

        Usuario.find( query )
            .skip(Number(from))
            .limit( Number(limit))
    ]) 
    
    res.json({
        total,
        usuarios
    })

}

const getPhotoProfile = async  (req = request , res = response ) => {

    const {_id : uid} = req.authenticatedUser;

    const usuario = await Usuario.findById(uid);
    
    const filePath = path.join( __dirname , '../uploads' , uid.toString() , 'profile', usuario.img );
    if(!fs.existsSync(filePath)){
        return res.status(404).json({
            ok : false ,
            message : 'imagen no encontrada'
            
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

    const usuario = await Usuario.findByIdAndUpdate(uid , informationUser ,{new:true});

    res.json({
        "message" : "Usuario actualizado",
        ok: true,
        usuario
    })
}


const usuariosPost = async (req = request, res = response ) => {

    const {nombre , correo , password } = req.body;

    const usuario = new Usuario({nombre , correo , password });

    //* encriptación  de la contraseña 

    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password , salt);

    //* Guardar en la base de datos 
    await usuario.save();

    const token = await generarJWT(usuario._id.toString());

    res.json({
        ok: true,
        message : "Usuario creado con exito",
        usuario ,
        token
    })

}

const usuariosDelete = async (req = request, res = response ) => {

    const {_id : uid} = req.authenticatedUser;

    const folderPath =  path.join( __dirname , '../uploads' , uid.toString() );
    
    try{
        
        //TODO : eliminar fisicamente del servidor 

        await rimraf(folderPath);
        
        //* Borrar fisicamente de la base de datos   
        await Usuario.findByIdAndDelete(uid.toString()); 
        
        res.status(200).json({
            ok: true,
            message : "Usuario eliminado"
        })

    }catch(e){
        console.log(e)
        return res.status(500).json({
            
            ok : false ,
            message : 'No ha sido posible eliminar el usuario  , por favor hable con el admistrador'
        })
    }   



}

const updatePhotoProfile  = async ( req = request , res = response ) => {
    const {_id : uid} = req.authenticatedUser;

    const { remove = false } = req.query;

    const usuario = await Usuario.findById(uid);

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
                message : 'imagen actualizada'
            })
            
        } catch (e) {
            console.log(e)
            return res.status(404).json({
                ok : false,
                message : 'no hay imagen para eliminar'
            })
        }
    }

    

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).json({
            ok : false ,
            message : 'No hay archivos que subir'
        });
    } 

    
    if( usuario.img){
        
        try {
            fs.unlinkSync(filePath)
            
        }catch (e){
            console.log(e);
            
            return res.status(500).json({
                ok : false,
                message : 'no ha sido posible eliminar el archivo  , por favor hable con el administrador'
            })
        }

    }  
    

    const { nameTemporary } = await uploadFile(req.files , undefined , uid.toString() , 'profile' );
    
    usuario.img = nameTemporary;
    usuario.save();

    res.json({
        ok : true,
        message : 'imagen actualizada'
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
