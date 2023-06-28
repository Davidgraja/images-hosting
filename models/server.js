const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config');
const  fileUpload = require('express-fileupload');
class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT
        this.usuarioPath = '/api/users';
        this.authPath = '/api/auth';
        this.uploadPath = '/api/upload'
        this.folderPath = '/api/folders'

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

        this.app.use(express.json())

        /*Configuración de Cors*/
        this.app.use(cors());

        // upload files config        
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
        
    }

    routes (){

        this.app.use(this.authPath , require('../routes/auth'));
        this.app.use( this.usuarioPath , require('../routes/user'));
        this.app.use( this.uploadPath , require('../routes/upload'));
        this.app.use( this.folderPath , require('../routes/folder'));

    }


    listen (){
        this.app.listen( this.port , () => {
            console.log('this server is listening in the port ' + this.port)
        });
    }
}

module.exports = Server;