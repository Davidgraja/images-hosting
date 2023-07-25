const { Router } = require('express');
const { getFiles , deleteImage, uploadFiles , updateFile} = require('../controllers/images.controller');
const { validarJWT, validarCampos, validateFile, validarArchivos , validateFolder } = require('../middlewares');
const { check } = require('express-validator');

const router = Router();

/**
 * @swagger
 * /api/images/{folderId}/{fileName}: 
 *  get:
 *      description: En este enpoint  optener una imagen asosiada a un usuario y carpeta
 *      summary: optener una imagen
 *      parameters:
 *          - in: header
 *            name: x-token
 *            schema:
 *                type: string
 *            required: true
 *            description:  token de autenticación del usuario entregado al hacer login o crear un usuario
 *          
 *          - in: path
 *            name: folderId
 *            schema:
 *                type: string
 *            required: true
 *            description: identificador de la carpeta
 * 
 *          - in: path
 *            name: fileName
 *            schema:
 *                type: string
 *            required: true
 *            description:  El nombre de la imagen
 *      tags: [Images]
 *      responses:
 *           200: 
 *              description: imagen del usuario
 *              content:
 *                 schema:
 *                    type: string
 *                    format: binary
 *           401:
 *              description: Error al validar el token de autenticación 
 *              content:
 *                  application/json: 
 *                      schema:
 *                        type: object
 *                        properties:
 *                            msg:
 *                               type: string
 *                               description: mensaje con el error al validar el jwt
 *           404:
 *              description: No se encontro la carpeta o imagen 
 *              content:
 *                  application/json: 
 *                      schema:
 *                         type: object
 *                         properties:
 *                            ok:
 *                               type: boolean
 *                               default : false    
 *                            msg:
 *                               type: string
 *                               descriptio: motivo del error
 *           400:
 *              description: se realizo una solicitud incorrecta
 *              content:
 *                application/json:
 *                   schema:
 *                       type: array
 *                       items:
 *                          type: object
 *                          properties:
 *                                  value:
 *                                      type: string
 *                                      description: El valor enviado
 *                                  msg: 
 *                                      type: string
 *                                      description: mensaje que te explica el error 
 *                                  param:
 *                                      type: string
 *                                      description: El parametro o propiedad que tiene el error
 *                                  location:
 *                                      type: string
 *                                      description: locación dentro de la request donde se obtuvo el error 
 *           500:
 *              description: Error al procesar la petición en el servidor
 *              content:
 *                  application/json: 
 *                      schema:
 *                        type: object
 *                        properties:
 *                            ok:
 *                               type: boolean
 *                               default : false    
 *                            msg:
 *                               type: string
 *                               default: no ha sido posible eliminar el archivo  , por favor hable con el administrador           
 */
router.get('/:folderId/:fileName', [
    validarJWT ,
    check( 'folderId' , 'Id no valido' ).isMongoId(),
    validarCampos,
    validateFile,
], getFiles );

/**
 * @swagger
 * /api/images/{id}: 
 *  post:
 *      description: En este enpoint subir  una imagen a una carpeta 
 *      summary: subir una  imagen a una carpeta asociada a un usuario 
 *      parameters:
 *          - in: header
 *            name: x-token
 *            schema:
 *                type: string
 *            required: true
 *            description:  token de autenticación del usuario entregado al hacer login o crear un usuario
 *          
 *          - in: path
 *            name: id
 *            schema:
 *                type: string
 *            required: true
 *            description: identificador de la carpeta
 *      tags: [Images]
 *      responses:
 *           200:
 *              description: ok, se subio correctamente la imagen 
 *              content:
 *                  application/json: 
 *                      schema:
 *                        type: object
 *                        properties:
 *                            ok:
 *                               type: boolean
 *                               default : true    
 *                            fileName:
 *                               type: string
 *                               desscription: Nombre de imagen subida
 *           401:
 *              description: Error al validar el token de autenticación 
 *              content:
 *                  application/json: 
 *                      schema:
 *                        type: object
 *                        properties:
 *                            msg:
 *                               type: string
 *                               description: mensaje con el error al validar el jwt
 *           404:
 *              description: No se se ah encontrado la imagen para subir o la carpeta no ha sido encontrada en nuestra base de datos 
 *              content:
 *                  application/json: 
 *                      schema:
 *                         type: object
 *                         properties:
 *                            ok:
 *                               type: boolean
 *                               default : false    
 *                            msg:
 *                               type: string
 *                               description: explicacion del error
 *           400:
 *              description: se realizo una solicitud incorrecta
 *              content:
 *                application/json:
 *                   schema:
 *                       type: array
 *                       items:
 *                          type: object
 *                          properties:
 *                                  value:
 *                                      type: string
 *                                      description: El valor enviado
 *                                  msg: 
 *                                      type: string
 *                                      description: mensaje que te explica el error 
 *                                  param:
 *                                      type: string
 *                                      description: El parametro o propiedad que tiene el error
 *                                  location:
 *                                      type: string
 *                                      description: locación dentro de la request donde se obtuvo el error 
 *           500:
 *              description: Error al procesar la petición en el servidor
 *              content:
 *                  application/json: 
 *                      schema:
 *                        type: object
 *                        properties:
 *                            ok:
 *                               type: boolean
 *                               default : false    
 *                            msg:
 *                               type: string
 *                               default: no ha sido posible eliminar el archivo  , por favor hable con el administrador           
 */
router.post('/:id' ,[ 
    validarJWT ,
    check('id' , 'el id no es valido').isMongoId(),
    validarCampos,
    validarArchivos,
    validateFolder
], uploadFiles);


router.put('/:folderId/:fileName' , [
    validarJWT,
    check( 'folderId' , 'Id no valido' ).isMongoId(),
    validarCampos,
    validateFile,
    validarArchivos
] , updateFile )

router.delete('/:folderId/:fileName', [
    validarJWT ,
    check( 'folderId' , 'Id no valido' ).isMongoId(),
    validarCampos,
    validateFile,
] , deleteImage);

module.exports = router;