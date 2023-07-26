const {Router} = require('express');
const { check } = require('express-validator');
const { login , renewToken} = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/validarCampos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

/**
 * @swagger
 * /api/auth/login: 
 *  post:
 *      description: En este enpoint puedes hacer autenticarte contra el servidor con correo y contraseña
 *      summary: Hacer login con correo y contraseña  
 *      tags: [Auth]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json : 
 *                    schema:
 *                      type: object
 *                      $ref: '#/components/schemas/User' 
 *      responses:
 *           200: 
 *              description: ok, imagen actualizada correctamente 
 *              content:
 *                  application/json: 
 *                      schema:
 *                        type: object
 *                        properties:
 *                            ok:
 *                               type: boolean
 *                               default: true
 *                            user:
 *                               type: object
 *                               $ref: '#/components/schemas/User'
 *                            token:
 *                               type: string
 *                               description: token de acceso , necesario para ejecutar mas tareas dentro del servidor 
 *           400:
 *              description: se realizo una solicitud incorrecta
 *              content:
 *                application/json:
 *                   schema:
 *                       type: array
 *                       items:
 *                          type: object
 *                          properties:
 *                                  ok:
 *                                      type: boolean
 *                                      default: false                       
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
 *                               default: Ha ocurrido un error , intentelo de nuevo o hable con el administrador          
 */
router.post('/login',[
    check('correo' , 'El correo no es valido , por favor veriquelo').isEmail(),
    check('password' , 'es obligatorio añadir una contraseña').notEmpty(),
    validarCampos
], login);

/**
 * @swagger
 * /api/auth/renew: 
 *  get:
 *      description: En este enpoint puedesrenovar tu token de autenticación
 *      summary: Renovación de token de autenticación 
 *      parameters:
 *           - in: header
 *             name: x-token
 *             schema: 
 *               type: string            
 *             required: true
 *             description: token de autenticación del usuario entregado al hacer login o crear un usuario 
 *      tags: [Auth]
 *      responses:
 *           200: 
 *              description: ok, imagen actualizada correctamente 
 *              content:
 *                  application/json: 
 *                      schema:
 *                        type: object
 *                        properties:
 *                            ok:
 *                               type: boolean
 *                               default: true
 *                            user:
 *                               type: object
 *                               $ref: '#/components/schemas/User'
 *                            token:
 *                               type: string
 *                               description: token de acceso , necesario para ejecutar mas tareas dentro del servidor 
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
 *                               default: Ha ocurrido un error , intentelo de nuevo o hable con el administrador          
 */
router.get('/renew' , validarJWT ,renewToken )

module.exports = router;