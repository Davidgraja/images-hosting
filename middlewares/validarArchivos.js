const {request, response}  = require("express");

const validarArchivos = ( req = request , res = response , next ) =>{
    
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).json({
            ok : false ,
            msg : 'No hay archivos que subir'
        });
    } 
    
    next();
}


module.exports = {
    validarArchivos
}