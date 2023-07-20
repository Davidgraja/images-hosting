const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT , validarCampos, validarArchivos , validateEmail} =  require('../middlewares');

const {usuariosGet , usuariosPut , usuariosPost , usuariosDelete , updatePhotoProfile , getPhotoProfile} = require("../controllers/user.controller")

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
*           example:
*               nombre: Juan Carlos
*               correo: juanCarlos47@gmail.com
*               password: juan47
*/

/**
 * @swagger
 * /api/users:
 *      get:
 *          summary: retorna todos los usuarios
 *          tags: [User] 
 *          responses:
 *              200:
 *                  description: ok , se entregan todos los usuarios
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items: 
 *                                  $ref: '#/components/schemas/User'
*/
router.get('/' ,  usuariosGet  );


router.get('/photo' , validarJWT , getPhotoProfile  );


router.patch('/' , [
    validarJWT ,
    validarArchivos
] , updatePhotoProfile );


router.put('/' ,[
    validarJWT,
], usuariosPut );


router.post('/' ,[
    check('correo' , 'el correo no es valido').isEmail(),
    check('nombre' , 'el nombre es obligatorio y con un minimo de 4 digitos').notEmpty().isLength({min:4}),
    check('password' , 'el password debe de ser mayor de 6 digitos').isLength({min:6}),
    validarCampos,
    validateEmail
] , usuariosPost );


router.delete('/', [
    validarJWT,
], usuariosDelete );

module.exports = router;