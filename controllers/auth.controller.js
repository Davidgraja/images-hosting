const fs = require("fs");
const path = require("path");

const { request, response } = require("express");
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require("../helpers/generar_jwt");

const login = async (req = request , res = response) => {

    const { correo } = req.body;

    try {
        const user = await Usuario.findOne({correo});
        
        if(!user){
            return res.status(404).json({
                ok : false , 
                msg : 'usuario no encontrado'
            });
        }
        const token = await generarJWT( user.id );

        res.json({
            ok : true,
            user,
            token
        })
        

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok : false , 
            msg : 'Por favor comuniquese con el administrador'
        });

    }
}

const loginWithProviders = async (req = request , res = response) =>{

    const { nombre , correo , img  , provider} = req.body;

    try {


        let user = await Usuario.findOne({ correo });

        if(!user){

            const infoUser = {
                nombre,
                correo,
                password : 'HosTingWeb12ñ'
            }

            const salt = bcrypt.genSaltSync();
            infoUser.password = bcrypt.hashSync(infoUser.password , salt);

            if(img){
                infoUser.img = img
            }

            if (provider === 'google.com'){
                infoUser.google = true
            }
            else infoUser.github = true

            user = new Usuario( infoUser);

            await user.save();

            const userPath = path.join( __dirname , '../uploads', user._id.toString());
            fs.mkdirSync(userPath);

        }

        const token = await generarJWT(user._id.toString())

        return res.json({   
            ok : true,
            user,
            token
        })
        
    }catch (e) {
        console.log(e)
        return res.status(500).json({
            ok : false,
            msg : 'Ah ocurrido un error , por favor intentelo de nuevo o hable con el administrador'
        })
    }
    
}

module.exports = {
    login,
    loginWithProviders
}