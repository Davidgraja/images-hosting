const {request, response} = require("express");
const FolderModel = require('../models/folder')


const validateFolder = async  (req = request , res = response , next) =>{
    const {id} = req.params;
    
    const validatingFolder = await FolderModel.findById(id);

    if(!validatingFolder){

        return res.status(404).json({
            ok : false,
            msg : `la carpeta no ha sido encontrada`
        })
        
    }

    next();

}

module.exports = {
    validateFolder
}