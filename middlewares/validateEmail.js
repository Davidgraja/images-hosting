const  {request, response} = require( "express");
const UsuarioModel = require('../models/usuario')
const validateEmail =  async ( req = request , res = response , next ) => {
    const {correo} = req.body;
    const validateEmail = await  UsuarioModel.findOne({correo});

    if(validateEmail){
        return res.status(400).json({
            ok : false ,
            msg : `El correo ${ correo } ya existe en nuestra base de datos , por favor intente con otro correo`
        })
    }
    
    next()
}
module.exports = {
    validateEmail
}