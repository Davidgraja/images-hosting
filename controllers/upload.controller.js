const { request , response} = require('express');
const {uploadFile} = require("../helpers");

const uploadFiles = async  ( req = request , res = response) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).json({
            ok : false ,
            message : 'No hay archivos que subir'
        });
    } 
      
    try {

        const fileName = await uploadFile(req.files , undefined , 'images' );
        res.json({
            ok : true,
            fileName
        })
        
    } catch (message) {
        res.status(400).json({
            ok : false,
            message 
        })
    }
    
    


   
}

module.exports = {
    uploadFiles
}