const express = require('express');
const cors = require('cors');
const { dbConection } = require('../database/config');
const  fileUpload = require('express-fileupload');

// Swagger 
const swaggerUi = require('swagger-ui-express')
const swagerJsDoc = require('swagger-jsdoc')
const swaggerSpec = require('../swagger/swaggerSpec')

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT
        this.usuarioPath = '/api/users';
        this.authPath = '/api/auth';
        this.folderPath = '/api/folders';
        this.imagesPath = '/api/images';
        this.documentationPath = '/';
        this.CSS_URL = 'https://cdn.jsdelivr.net/npm/s wagger-ui-themes@3.0.0 / themes/3.x/theme-newspaper.css'

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
        this.app.use( this.folderPath , require('../routes/folder'));
        this.app.use( this.imagesPath , require('../routes/images'));
        this.app.use(this.documentationPath , swaggerUi.serve , swaggerUi.setup(swagerJsDoc(swaggerSpec) , { customCssUrl: this.CSS_URL }) )
    }


    listen (){
        this.app.listen( this.port , () => {
            console.log('this server is listening in the port ' + this.port)
        });
    }
}

module.exports = Server;