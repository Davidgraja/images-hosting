const { response , request } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const {generarJWT} = require("../helpers/generar_jwt");

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

const usuariosPut =  async (req = request, res = response ) => {

    const id = req.params.id;
    const { _id , images , password , google ,correo, nombre,...informationUser } = req.body;
  
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

    const usuario = await Usuario.findByIdAndUpdate(id , informationUser ,{new:true});

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

    const {id} = req.params;
    
    //* Borrar fisicamente  
     const usuario = await Usuario.findByIdAndDelete(id);

    //* Forma recomendada , esto para mantener la integridad referencial en la base de datos
//    const usuario = await Usuario.findByIdAndUpdate( id , { estado : false } , {new : true} );

    res.json({
        ok: true,
        message : "Usuario eliminado",    
        usuario
    })

}


module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
}
