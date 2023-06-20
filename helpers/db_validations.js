const Usuario = require('../models/usuario');

const validateExistingEmail =  async ( correo = '' ) => {

    const validateEmail = await  Usuario.findOne({correo});

    if(validateEmail){
        throw new Error(`El correo ${ correo } ya existe en nuestra base de datos , por favor intente con otro correo`);
    }
}


module.exports = {
    validateExistingEmail,
}