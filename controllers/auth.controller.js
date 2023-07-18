const { request, response } = require("express");
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require("../helpers/generar_jwt");

const login = async (req = request , res = response) => {
    
    const msgNoFound = 'correo o passsword incorrectos por favor verifique sus credenciales e intentelo de nuevo'
    
    const { correo , password } = req.body;

    try {

        //? Verificación de que exista el correo 
        const user = await Usuario.findOne({correo});

        if( !user ){
            return res.status(400).json({
                ok : false ,
                msg :msgNoFound
            });
        }

        //? Verificación de la contraseña 
        const validatePassword = bcrypt.compareSync(password , user.password);

        if( !validatePassword ){
            return res.status(400).json({
                ok : false,
                msg : msgNoFound
            });
        }

        //? Generación del JWT 
        const token = await generarJWT( user.id );

        res.json({
            ok : true,
            user,
            token
        })


    } catch (error) {

        return res.status(500).json({
            ok : false , 
            msg : 'Por favor comuniquese con el administrador'
        });

    }
}

module.exports = {
    login
}