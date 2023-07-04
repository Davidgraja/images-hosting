const validarJwt = require('../middlewares/validar-jwt');
const validarCampos  = require('../middlewares/validarCampos');
const validarArchivos = require('./validarArchivos');

module.exports = {
    ...validarJwt,
    ...validarCampos,
    ...validarArchivos,
}