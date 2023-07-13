const generarJwt   = require('./generar_jwt');
const uploadFile   = require('./uploadFile');
const isValidObjectId   = require('./isValidObjectId');

module.exports = {
    ...generarJwt , 
    ...uploadFile,
    ...isValidObjectId
}