const { request , response} = require('express');
const {uploadFile} = require("../helpers");

const uploadFiles = async  ( req = request , res = response) => {

        
    const {_id : uid} = req.authenticatedUser;
    
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).json({
            ok : false ,
            message : 'No hay archivos que subir'
        });
    } 
      
    try {

        const fileName = await uploadFile(req.files , undefined , uid.toString() ,'images' );
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

//const updateImage = (req = request, res = response) => {
//    
//    const { id , collection } = req.params; 
//
//    res.json({
//        id,
//        collection
//    })   
//
//}

module.exports = {
    uploadFiles,
//    updateImage
}