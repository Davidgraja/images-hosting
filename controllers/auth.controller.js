const { request, response } = require("express");
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/generar_jwt");

const login = async (req = request , res = response) => {

    const { correo , password } = req.body;

    try {

        //? Verificación de que exista el correo 
        const usuario = await Usuario.findOne({correo});
        
        if( !usuario ){
            return res.status(400).json({
                message : 'correo / passsword no son correctos - correo'
            });
        }

        //? Verificación si el usuario esta activo 
        if( !usuario.estado ){
            return res.status(400).json({
                message : 'correo / passsword no son correctos - estado : false'
            });
        }

        //? Verificación de la contraseña 
        const validatePassword = bcryptjs.compareSync(password , usuario.password);

        if( !validatePassword ){
            return res.status(400).json({
                message : 'correo / passsword no son correctos - password : false'
            });
        }

        //? Generación del JWT 
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })
        

    } catch (error) {
        
        return res.status(500).json({
            message : 'Por favor comuniquese con el administrador'
        });

    }
}

module.exports = {
    login ,
//    googleSingIn
}