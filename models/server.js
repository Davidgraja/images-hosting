const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT
        this.usuarioPath = '/api/users';
        this.authPath = '/api/auth';

        // conección de la base de datos 
        this.conectarDB();

        /*Middlewares*/
        this.middlewares();

        /*Rutas del servidor*/
        this.routes();

    }

    async conectarDB(){
        await dbConection();
    }

    middlewares (){

        /*Lectura y pareseo de la informacion del body*/

        this.app.use(express.json())

        /*Configuración de Cors*/
        this.app.use(cors());

        /*Dicrectorio publico*/
        this.app.use(express.static('public'));
    }

    routes (){

        this.app.use(this.authPath , require('../routes/auth'));
        this.app.use( this.usuarioPath , require('../routes/user'));
    }


    listen (){
        this.app.listen( this.port , () => {
            console.log('this server is listening in the port ' + this.port)
        });
    }
}

module.exports = Server;