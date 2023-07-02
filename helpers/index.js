const dbValidatios = require('./db_validations');
const generarJwt   = require('./generar_jwt');
const uploadFile   = require('./uploadFile');
const isValidObjectId   = require('./isValidObjectId');

module.exports = {
    ...dbValidatios ,
    ...generarJwt , 
    ...uploadFile,
    ...isValidObjectId
}