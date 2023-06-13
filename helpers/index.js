const dbValidatios = require('./db_validations');
const generarJwt   = require('./generar_jwt');
const uploadFile   = require('./uploadFile');

module.exports = {
    ...dbValidatios ,
    ...generarJwt , 
    ...uploadFile
}