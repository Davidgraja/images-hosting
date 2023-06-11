const validarJwt = require('../middlewares/validar-jwt');
const validarCampos  = require('../middlewares/validarCampos');

module.exports = {
    ...validarJwt,
    ...validarCampos
}