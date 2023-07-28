const path = require('path')

const swaggerConfig = {
    definition :{
        openapi : "3.1.0",
        info : {
            title : "Hosting de imagenes",
            version : "1.0.0",
            description : "Bienvenido a este servicio de hosting de imagenes , en este encontraras las operaciones basicas para subir , actualizar , eliminar y optener  tus imagenes , tienes la posiblidad de almacenar estas imagenes por carpetas  y usuarios , Esta es la  version 1.0.0  pero estamos trabajando en proximas versiones con muchas mas funcionalidades.",
            contact : {
                name : "Julio David Grajales",
                email : "juliograjalesparedes127@gmail.com"
            },
        },
        servers : [
            {
<<<<<<< HEAD
                url: "https://images-hosting.vercel.app"
=======
                url : "http://localhost:8080"
            },
            {
                url : "https://images-hosting.vercel.app"
>>>>>>> swagger
            }
        ] 
    },
    apis : [`${path.join(__dirname, '../routes/*.js')}`]
}

module.exports = swaggerConfig