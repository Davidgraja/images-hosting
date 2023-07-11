const fs = require("fs");
const path = require("path");

const { request, response } = require("express");
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require("../helpers/generar_jwt");

const login = async (req = request , res = response) => {

    const { correo , password } = req.body;

    try {

        //? Verificación de que exista el correo 
        const usuario = await Usuario.findOne({correo});
        
        if( !usuario ){
            return res.status(400).json({
                ok : false ,
                msg : 'correo / passsword no son correctos'
            });
        }

        //? Verificación si el usuario esta activo 
        if( !usuario.estado ){
            return res.status(400).json({
                ok : false ,
                msg : 'correo / passsword no son correctos'
            });
        }

        //? Verificación de la contraseña 
        const validatePassword = bcrypt.compareSync(password , usuario.password);

        if( !validatePassword ){
            return res.status(400).json({
                ok : false,
                msg : 'correo / passsword no son correctos - password : false'
            });
        }

        //? Generación del JWT 
        const token = await generarJWT( usuario.id );

        res.json({
            ok : true,
            usuario,
            token
        })
        

    } catch (error) {
        
        return res.status(500).json({
            ok : false , 
            msg : 'Por favor comuniquese con el administrador'
        });

    }
}

const loginWithGoogle = async  ( req = request , res = response ) => {
    
    const { nombre , correo , img } = req.body;
        
    try {
    
        let user = await Usuario.findOne({ correo });
        
        if(!user){
            
            const infoUser = {
                nombre,
                correo,
                password : 'HosTingWeb12ñ',
                google: true
            }
            
            const salt = bcrypt.genSaltSync();
            infoUser.password = bcrypt.hashSync(infoUser.password , salt);
            
            if(img){
                infoUser.img = img
            }
            
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

const loginWithGithub = async ( req = request , res = response) =>{
    const { nombre , correo , img } = req.body;

    try {

        let user = await Usuario.findOne({ correo });

        if(!user){

            const infoUser = {
                nombre,
                correo,
                password : 'HosTingWeb12ñ',
                github: true
            }

            const salt = bcrypt.genSaltSync();
            infoUser.password = bcrypt.hashSync(infoUser.password , salt);

            if(img){
                infoUser.img = img
            }

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
    loginWithGoogle,
    loginWithGithub
}