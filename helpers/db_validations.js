const Usuario = require('../models/usuario');
const FolderModel = require('../models/folder');

const validateExistingEmail =  async ( correo = '' ) => {

    const validateEmail = await  Usuario.findOne({correo});

    if(validateEmail){
        throw new Error(`El correo ${ correo } ya existe en nuestra base de datos , por favor intente con otro correo`);
    }
}


const validateExistingFolder =  async ( id = '' ) => {
    
    const validatingFolder = await FolderModel.findById(id);

    if(!validatingFolder){
        throw new Error(`la carpeta no ha sido encontrada`);
    }

}


module.exports = {
    validateExistingEmail,
    validateExistingFolder
}