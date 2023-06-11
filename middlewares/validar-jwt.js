const { request, response } = require('express');
const JWT = require('jsonwebtoken');

const Usuario = require('../models/usuario');


const validarJWT = async ( req= request , res = response , next ) => {

    const token = req.header('x-token');

    if(!token) {
        return  res.status(401).json({
            message : 'El token no ha sido recibido'
        })
    }

    try {
        
        const {uid} =  JWT.verify(token , process.env.SECRETORPRIVATEKEY );
        
        const usuario = await Usuario.findById(uid);

        if( !usuario ){
            return res.status(401).json({
                message : 'Acción  no valida para este usuario , No se ha encontrado en nuestra base de datos'
            })
        }
        
        //* podemos crear porpiedades dentro de la request , esto es oerfecto ya que la request es un objeto por referencia , esto quiere decir que lo que implementemos aqui podemos obtenerlo  mas adelante 
        req.authenticatedUser = usuario
        

        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({
            message : 'El token enviado no es valido'
        })

    }

}

module.exports ={
    validarJWT
}