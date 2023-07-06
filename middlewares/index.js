const validarJwt = require('../middlewares/validar-jwt');
const validarCampos  = require('../middlewares/validarCampos');
const validarArchivos = require('./validarArchivos');
const validateFile = require('./validateFile');

module.exports = {
    ...validarJwt,
    ...validarCampos,
    ...validarArchivos,
    ...validateFile
}