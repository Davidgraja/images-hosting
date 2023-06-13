const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = (files , extensionsValidated = ['png' , 'jpg' , 'jpeg' , 'gif'] , folder = '') => {
    
    return new Promise((resolve, reject)=> {
        
        const { file } = files;
        const fileName = file.name.split('.');
        const extension = fileName[ fileName.length - 1 ];

        // validar extensiones :
        if( !extensionsValidated.includes((extension)) ){
            return reject( ` La extension ${ extension } no es permitida , el servidor solo permite las siguientes extensiones : ${ extensionsValidated } ` );
        }

        const nameTemporary = uuidv4() + '.' + extension;
        const uploadPath = path.join( __dirname, '../uploads/' , folder ,  nameTemporary );

        file.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }
                
            resolve( nameTemporary );
            
        });
    })
}


module.exports = {
    uploadFile
}