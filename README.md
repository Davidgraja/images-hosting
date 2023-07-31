# Backend de hosting de imagenes
### información del servicio:
Bienvenido a este servicio de hosting de imagenes , en este servicio encontraras las operaciones basicas y necesarias para la manipulacion de imagenes , operaciones como el alojar , actualizar , eliminar y obtener dichas imagenes.

El servidor esta orientado a  poder manipular imagenes , pero ademas permite la creación de usuarios y carpetas a las cuales estas imagenes van a estar asociadas , junto esto se añadio la autenticacion de los usuarios por medio de [JWT](https://jwt.io/)

***_Nota_*** : Algo a tener en cuenta ,  es que este  proyecto es totalmente educativo , inicie este proyecto con la intencion de conocer y profundizar mis conocimientos en el entorno backend , por lo tanto es un proyecto totalmente educativo el cual espero mejorar aun mas 🙂.


Ahora puedes tomar como base de codigo este proyecto y puedes hacerlo de la siguiente manera:

## Instalación
El servicio esta construido con [Node js](https://nodejs.org/es) , por lo cual es necesario tenerlo instalado de manera local en nuestra maquina de desarrollo 

- con Node js  instalado , podremos realizar la clonacion de este repositorio :

  HTTPS:

  ```bash
    https://github.com/Davidgraja/images-hosting.git 

  ```

  SSH :
  ```bash
    git@github.com:Davidgraja/images-hosting.git 

  ```

  Github CLI :
  ```bash
    gh repo clone Davidgraja/images-hosting 

  ```

- Navega hacia la carpeta images-hosting e  instala sus dependencias:

  ```bash
    cd Backend-Calendar
  ```
  ```bash
    npm install 
  ```
- configura tus variables de entorno dentro de un archivo __.env__ : 

  `PORT` : puerto en cual quieres que corra de manera local tu servicio 

  `MONGO_CNN` : cadena de conexion a MongoDB , ya que es esta la base de datos que estamos usando

  `SECRETORPRIVATEKEY` : una llave privada para la firma de tokens en el servicio 


- Levanta tu servicio :

  ```bash
    npm start   
  ```
  Si haces uso de  [nodemon](https://www.npmjs.com/package/nodemon) puedes ejecutar el comando 
  ```bash
    npm run dev   
  ```
  
  o puedes ejecutar el archivo `index.js` directamente con node :
  ```bash
    node index.js   
  ```

Con estos pasos ya deberías de tener tu servicio funcionando 😊


## Herramientas principales usadas:
- [Node js](https://nodejs.org/es) 
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [express](https://expressjs.com/es/)
- [cors](https://www.npmjs.com/package/cors)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express-validator](https://express-validator.github.io/docs)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [express-fileupload](https://www.npmjs.com/package/express-fileupload)
- [mongoose](https://mongoosejs.com/)
- [rimraf](https://www.npmjs.com/package/rimraf)
- [uuid](https://www.npmjs.com/package/uuid)
## Documentación: 
El proyecto actualmente se encuentra desplegado  y puedes hacer peticiones a este en : https://images-hosting.vercel.app , ademas puedes ver otra documentacion si asi lo deseas en [postman](https://documenter.getpostman.com/view/23520684/2s946h9sej) 