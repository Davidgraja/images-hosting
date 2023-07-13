const validarJwt = require('../middlewares/validar-jwt');
const validarCampos  = require('../middlewares/validarCampos');
const validarArchivos = require('./validarArchivos');
const validateFile = require('./validateFile');
const validateEmail = require('./validateEmail');
const validateFolder = require('./validateFolder')

module.exports = {
    ...validarJwt,
    ...validarCampos,
    ...validarArchivos,
    ...validateFile,
    ...validateEmail,
    ...validateFolder
}