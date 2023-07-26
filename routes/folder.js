const { Router } = require('express')
const { createFolder, updateFolder ,deleteFolder , getFolders , getFolder} = require('../controllers/folder.controller');
const { validarJWT, validarCampos , validateFolder} = require('../middlewares');
const { check } = require('express-validator');

const router = Router();

/**
 *@swagger
 *  components:
 *      schemas:
 *          Folder:
 *              type: object 
 *              properties:
 *                  _id:
 *                      type: string
 *                      description: identificador unico de la carpeta
 *                  nombre:
 *                      type: string
 *                      description: nombre de la carpeta
 *                  imagenes:
 *                      type: array
 *                      description: imagenes asociadas a la carpeta
 *                  usuario:
 *                      type: object
 *                      $ref: '#/components/schemas/User'
 *                      description: id del usuario al que esta asociada la carpeta
 *              required:
 *                  - nombre     
 *              example:
 *                  -id: 69be97e589b81590c58cd180
 *                  nombre: personal
 *                  imagenes: []
 *                  usuario:
 *                      _id: 64be97e370b81590c58cd180
 *                      nombre: juan Carlos
 *                      correo: juanCarlos45@gmail.com                 
 */

 /**
 * @swagger
 * /api/folders/search:
 *  get:
 *      summary: obtener carpeta por su nombre o identificador(id)
 *      description: Enpoint que te permitira buscar una carpeta ya sea por su nombre o identificador(id) , es importante enviar aunque sea uno de los dos
 *      tags: [Folder] 
 *      parameters:
 *          - in: header
 *            name: x-token
 *            schema:
 *                type: string
 *            required: true
 *            description:  token de autenticación del usuario entregado al hacer login o crear un usuario
 *          - in: query
 *            name: nombre
 *            schema:
 *              type: string
 *            description: Nombre por el cual desea buscar la carpeta
 *          - in: query
 *            name: id
 *            schema:
 *              type: string
 *            description: Identificador por el cual desea buscar la carpeta
 *      responses:
 *           200:
 *             description: se entrega la carpeta encontrada
 *             content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              ok: 
 *                                  type: boolean
 *                                  default : true
 *                              folder:
 *                                  type: object
 *                                  $ref: '#/components/schemas/Folder'
 *           401:
 *             description: Error al validar el token de autenticación 
 *             content:
 *                  application/json: 
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                type: string
 *                                description: mensaje con el error al validar el jwt
 *           400:
 *             description: El identificador no es valido , o no se ha enviado ninguno de los campos necesario para ejecutar correctamente el enpoint 
 *             content:
 *                  application/json: 
 *                      schema:
 *                          type: object
 *                          properties:
 *                              ok:
 *                                type: boolean
 *                                defualt: false
 *                              msg:
 *                                type: string
 *                                description: mensaje descriptivo con el error 
 *           404:
 *             description: No se ha encontrado la carpeta  
 *             content:
 *                  application/json: 
 *                      schema:
 *                          type: object
 *                          properties:
 *                              ok:
 *                                type: boolean
 *                                defualt: false
 *                              msg:
 *                                type: string
 *                                description: mensaje con el error al validar el jwt
 *            
 */
router.get('/search' ,[
    validarJWT
] , getFolder );

 /**
 * @swagger
 * /api/folders:
 *  get:
 *      summary: obtener todas las carpetas de un usuario 
 *      description: Enpoint que te permitira optener todas las carpetas creadas por un usuario
 *      tags: [Folder] 
 *      parameters:
 *          - in: header
 *            name: x-token
 *            schema:
 *                type: string
 *            required: true
 *            description:  token de autenticación del usuario entregado al hacer login o crear un usuario
 *      responses:
 *           200:
 *             description: se entregaran todas las carpetas encontradas
 *             content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              ok: 
 *                                  type: boolean
 *                                  default : true
 *                              folders:
 *                                  type: array
 *                                  items:
 *                                      $ref: '#/components/schemas/Folder'
 *           401:
 *             description: Error al validar el token de autenticación 
 *             content:
 *                  application/json: 
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                type: string
 *                                description: mensaje con el error al validar el jwt
 *           500:
 *             description: Error del servidor
 *             content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              ok: 
 *                                  type: boolean
 *                                  default : false
 *                              msg:
 *                                  type: string
 *                                  default: Ha ocurrido un error , intentelo de nuevo o hable con el administrador
 */
router.get('/' , validarJWT , getFolders )

 /**
 * @swagger
 * /api/folders:
 *  post:
 *      summary: crear una carpeta 
 *      description: Enpoint que te permitira crear una carpeta asociada a un a un usuario 
 *      tags: [Folder] 
 *      parameters:
 *          - in: header
 *            name: x-token
 *            schema:
 *                type: string
 *            required: true
 *            description:  token de autenticación del usuario entregado al hacer login o crear un usuario
 *          - in: query
 *            name: folderName
 *            schema:
 *              type: string
 *            description: El nombre con el que desea nombrar la carpeta
 
 *      responses:
 *           200:
 *             description: se entrega la carpeta encontrada
 *             content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              ok: 
 *                                  type: boolean
 *                                  default : true
 *                              msg:
 *                                  type: string
 *                                  default: Carpeta creada con exito
 *                              folder:
 *                                  type: object
 *                                  $ref: '#/components/schemas/Folder'
 *           401:
 *             description: Error al validar el token de autenticación 
 *             content:
 *                  application/json: 
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                type: string
 *                                description: mensaje con el error al validar el jwt
 *           400:
 *             description: El nombre enviado para la carpeta no es permitido , puede que ya se encuentre en uso el nombre enviado o no  se envio el nombre en la petición 
 *             content:
 *                  application/json: 
 *                      schema:
 *                          type: object
 *                          properties:
 *                              ok:
 *                                type: boolean
 *                                defualt: false
 *                              msg:
 *                                type: string
 *                                description: mensaje descriptivo sobre el porque  del error 
 *           500:
 *             description: Error del servidor
 *             content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              ok: 
 *                                  type: boolean
 *                                  default : false
 *                              msg:
 *                                  type: string
 *                                  default: Ha ocurrido un error , intentelo de nuevo o hable con el administrador
 */
router.post('/' ,[
    validarJWT,
    check('folderName', 'Es necesario añadir un nombre para su carpeta').notEmpty(),
    validarCampos
] , createFolder );

 /**
 * @swagger
 * /api/folders/{id}:
 *  patch:
 *      summary: actualizar carpeta 
 *      description: Enpoint que te permitira actualizar una carpeta asociada a un usuario
 *      tags: [Folder] 
 *      parameters:
 *          - in: header
 *            name: x-token
 *            schema:
 *                type: string
 *            required: true
 *            description:  token de autenticación del usuario entregado al hacer login o crear un usuario
 *          - in: path
 *            name: id
 *            schema:
 *                type: string
 *            required: true
 *            description:  id de la carpeta
 *      requestBody:
 *           content:
 *              application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              nombre:
 *                                  type: string
 *                                  description: Nuevo nombre de la carpeta
 *                                  required: true                               
 *      responses:
 *           200:
 *             description: se entrega la carpeta encontrada
 *             content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              ok: 
 *                                  type: boolean
 *                                  default : true
 *                              msg:
 *                                  type: string
 *                                  default: Carpeta actualizada
 *           401:
 *             description: Error al validar el token de autenticación 
 *             content:
 *                  application/json: 
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                type: string
 *                                description: mensaje con el error al validar el jwt
 *           400: 
 *             description: El id enviado no es valido  o el campo nombre dentro del body no fue enviado o se envio en un formato incorecto
 *             content:
 *                  application/json: 
 *                      schema:
 *                          type: object
 *                          properties:
 *                              ok:
 *                                type: boolean
 *                                defualt: false
 *                              msg:
 *                                type: string
 *                                description: mensaje descriptivo sobre el porque  del error
 *           404:
 *              description: No se encontro la carpeta en la base de datos 
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
 *                               default: la carpeta no ha sido encontrada 
 *           500:
 *             description: Error del servidor
 *             content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              ok: 
 *                                  type: boolean
 *                                  default : false
 *                              msg:
 *                                  type: string
 *                                  default: Ha ocurrido un error , intentelo de nuevo o hable con el administrador
 */
router.patch('/:id' , [
    validarJWT,
    check('id' , 'el id no es valido , por favor verifiquelo e intentelo de nuevo').isMongoId(),
    validarCampos,
    validateFolder
], updateFolder);

 /**
 * @swagger
 * /api/folders/{id}:
 *  delete:
 *      summary: Eliminar carpeta 
 *      description: Enpoint que te permitira eliminar una carpeta asociada a un usuario
 *      tags: [Folder] 
 *      parameters:
 *          - in: header
 *            name: x-token
 *            schema:
 *                type: string
 *            required: true
 *            description:  token de autenticación del usuario entregado al hacer login o crear un usuario
 *          - in: path
 *            name: id
 *            schema:
 *                type: string
 *            required: true
 *            description:  id de la carpeta                             
 *      responses:
 *           200:
 *             description: se entrega la carpeta encontrada
 *             content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              ok: 
 *                                  type: boolean
 *                                  default : true
 *                              msg:
 *                                  type: string
 *                                  default: Carpeta eliminada
 *           401:
 *             description: Error al validar el token de autenticación 
 *             content:
 *                  application/json: 
 *                      schema:
 *                          type: object
 *                          properties:
 *                              msg:
 *                                type: string
 *                                description: mensaje con el error al validar el jwt
 *           400: 
 *             description: El id enviado no es valido  o el campo nombre dentro del body no fue enviado o se envio en un formato incorecto
 *             content:
 *                  application/json: 
 *                      schema:
 *                          type: object
 *                          properties:
 *                              ok:
 *                                type: boolean
 *                                defualt: false
 *                              msg:
 *                                type: string
 *                                description: mensaje descriptivo sobre el porque  del error
 *           404:
 *              description: No se encontro la carpeta en la base de datos 
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
 *                               default: la carpeta no ha sido encontrada 
 *           500:
 *             description: Error del servidor
 *             content: 
 *                  application/json:
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              ok: 
 *                                  type: boolean
 *                                  default : false
 *                              msg:
 *                                  type: string
 *                                  default: Ha ocurrido un error , intentelo de nuevo o hable con el administrador
 */
router.delete('/:id' , [
    validarJWT,
    check('id' , 'el id no es valido , por favor verifiquelo e intentelo de nuevo').isMongoId(),
    validarCampos,
    validateFolder
], deleteFolder)

module.exports= router
