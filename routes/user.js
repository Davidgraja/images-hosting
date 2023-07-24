const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT , validarCampos , validateEmail} =  require('../middlewares');

const {usuariosGet , usuariosPut , usuariosPost , usuariosDelete , updatePhotoProfile , getPhotoProfile, usuarioGet} = require("../controllers/user.controller")

const router = Router();

/**
* @swagger
* components: 
*   schemas:
*       User:
*           type: object
*           properties:
*               nombre:
*                   type: string
*                   description: el nombre del usuario
*               correo:
*                   type: string
*                   description: correo electronico del usuario
*               password:
*                   type: string
*                   description: contraseña del usuario
*               img: 
*                   type: string
*                   description: imagen del usuario 
*               estado:
*                   type: boolean
*                   description: estado del usuario
*           required:
*               - nombre
*               - correo
*               - password
*/

/**
* @swagger
* /api/users:
*   get:
*       description: Este Enpoint te retornara todos los usuarios registrados en la base de datos
*       summary: Obtener todos los usuarios 
*       tags: [User] 
*       responses:
*           200:
*              description: ok , se entregan todos los usuarios
*              content:
*                 application/json:
*                     schema:
*                        type: array
*                        items: 
*                           $ref: '#/components/schemas/User'
* 
* 
*/
router.get('/' ,  usuariosGet  );

/**
* @swagger
* /api/users/user:
*   get:
*       description: Este Enpoint te retorna un solo usuario en base a su token de autenticación
*       summary: Obtener un usuario 
*       parameters:
*          - in: header
*            name: x-token
*            schema:
*                type: string
*            required: true
*            description:  token de autenticación del usuario entregado al hacer login o crear un usuario
*       tags: [User] 
*       responses:
*           200:
*              description: ok , se entregara el usuario
*              content:
*                 application/json:
*                     schema:
*                        type: object
*                        properties:
*                            usuario:
*                               type: object
*                               $ref: '#/components/schemas/User'
*           401:
*              description: Error al validar el token de autenticación 
*              content:
*                  application/json: 
*                      schema:
*                          type: object
*                          properties:
*                              msg:
*                                type: string
*                                description: mensaje con el error al validar el jwt    
*/
router.get('/user' , validarJWT , usuarioGet)

/**
* @swagger
* /api/users/photo:
*   get:
*       description: Este Enpoint puedes obtener la foto del usuario
*       summary: optener foto de usuario
*       tags: [User] 
*       parameters:
*           - in: header
*             name: x-token
*             schema: 
*               type: string            
*             required: true
*             description: token de autenticación del usuario entregado al hacer login o crear un usuario
*       responses:
*           200: 
*              description: imagen del usuario
*              content:
*                 schema:
*                    type: string
*                    format: binary 
*           404:
*              description: No se encontro la imagen del usuario
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
*                               default: imagen no encontrada   
*           401:
*              description: Error al validar el token de autenticación 
*              content:
*                  application/json: 
*                      schema:
*                          type: object
*                          properties:
*                              msg:
*                                type: string
*                                description: mensaje con el error al validar el jwt                              
*/
router.get('/photo' , validarJWT , getPhotoProfile  );

/**
* @swagger
* /api/users/image:
*   patch:
*       description: Este Enpoint te permite actualizar la imagen de un usuario , solo seran permitidas aquellas imagenes con extencion  png , jpg , jpeg , gif
*       summary: actualizar foto de un usuario
*       tags: [User] 
*       parameters:
*          - in: header
*            name: x-token
*            schema:
*                type: string
*            required: true
*            description:  token de autenticación del usuario entregado al hacer login o crear un usuario 
* 
*          - in: query
*            name: remove
*            schema: 
*               type: boolean
*            description: con remove puedes eliminar la imagen del usuario desde este mismo enpoint , solo debes enviarlo cuando quieras eliminar la eliminar la imagen actual caso contrario puedes ignorarlo
*
*       requestBody:
*           content:
*              multipart/form-data:  
*                  schema:
*                        type: object
*                        properties:
*                            file:
*                                type: string
*                                format: binary                                                       
*                       
*
*       responses:
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
*           200:
*              description: ok, se actualizo correctamente la imagen del usuario 
*              content:
*                  application/json: 
*                      schema:
*                        type: object
*                        properties:
*                            ok:
*                               type: boolean
*                               default : true    
*                            msg:
*                               type: string
*                               default: imagen actualizada
*           404:
*              description: No se encontro la imagen , no hay imagen por eliminar 
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
*                               default: no hay imagen para eliminar
*           400:
*              description: No se envio la imagen para asignarsela al usuario
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
*                               default: No hay archivos que subir
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
router.patch('/image' , [
    validarJWT 
] , updatePhotoProfile );

/**
* @swagger
* /api/users:
*   put:
*       description: Este Enpoint puedes actualizar los datos de un usuario , no es obligatorio enviar todos los campos , solo aquel que deseas actualizar
*       summary: Actualizar un usuario
*       tags: [User]
*       parameters:
*           - in: header
*             name: x-token
*             schema: 
*               type: string            
*             required: true
*             description: token de autenticación del usuario entregado al hacer login o crear un usuario
*       requestBody:
*             content:
*                application/json:
*                    schema:
*                        type: object
*                        $ref: '#/components/schemas/User'
*       responses:
*            200:
*             description: se actualizo el usuario 
*             content:
*               application/json:
*                   schema:
*                       type: object
*                       properties:
*                            msg: 
*                               type: string
*                               default: Usuario actualizado
*                            ok:
*                               type: boolean
*                               default: true
*                            usuario:
*                               type: object
*                               $ref: '#/components/schemas/User'
*            400:
*             description: Error en uno de los campos enviados 
*             content:
*               application/json:
*                   schema:
*                       type: object
*                       properties:
*                            msg: 
*                               type: string
*                               description: mensaje con el motivo del error
*                            ok:
*                               type: boolean
*                               description: boleano que indica si salio todo correcto
*                               default: false
*            401:
*              description: Error al validar el token de autenticación 
*              content:
*                  application/json: 
*                      schema:
*                          type: object
*                          properties:
*                              msg:
*                                type: string
*                                description: mensaje con el error al validar el jwt
*/
router.put('/' ,[
    validarJWT,
], usuariosPut );


/**
 * @swagger
 * /api/users:
 *  post:
 *      summary: crear un usuario
 *      description: En este enpoint puedes crear usuarios
 *      tags: [User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json : 
 *                    schema:
 *                      type: object
 *                      $ref: '#/components/schemas/User'   
 *      responses:
 *          200:
 *            description: Usuario creado con exito
 *            content:
 *                application/json:
 *                   schema:
 *                       type: object
 *                       properties:
 *                           ok: 
 *                             type: boolean
 *                             description: boleano que indica si todo salio correcto o no
 *                           msg:
 *                             type: string
 *                             description : mensaje de confirmación de la creacion de usuario
 *                           usuario:
 *                             type: object
 *                             $ref:  '#/components/schemas/User'
 *                           token:
 *                             type: string
 *                             description: token de acceso , necesario para la ejecucion de otros enpoints dentro del servidor
 *          400:
 *            description: se realizo una solicitud incorrecta
 *            content:
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
 */
router.post('/' ,[
    check('correo' , 'el correo no es valido').isEmail(),
    check('nombre' , 'el nombre es obligatorio y con un minimo de 4 digitos').notEmpty().isLength({min:4}),
    check('password' , 'el password debe de ser mayor de 6 digitos').isLength({min:6}),
    validarCampos,
    validateEmail
] , usuariosPost );

/**
* @swagger
* /api/users:
*   delete:
*       summary: Eliminar un usuario 
*       tags: [User] 
*       responses:
*           200:
*              description: ok , se elimino el usuario 
*              content:
*                 application/json:
*                     schema:
*                        type: object
*                        properties: 
*                           ok: 
*                               type: boolean
*                               default: true            
*                           msg:
*                               type: string
*                               default: Usuario eliminado 
*           500:
*              description: hubo un error en el servidor  
*              content:
*                 application/json:
*                     schema:
*                        type: object
*                        properties: 
*                           ok: 
*                               type: boolean
*                               default: false            
*                           msg:
*                               type: string
*                               default: No ha sido posible eliminar el usuario  , por favor hable con el admistrador
*           401:
*              description: Error al validar el token de autenticación 
*              content:
*                  application/json: 
*                      schema:
*                          type: object
*                          properties:
*                              msg:
*                                type: string
*                                description: mensaje con el error al validar el jwt    
*/
router.delete('/', [
    validarJWT,
], usuariosDelete );

module.exports = router;