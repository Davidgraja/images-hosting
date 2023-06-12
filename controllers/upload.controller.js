const path = require('path');
const { request , response} = require('express');

const uploadFiles = ( req = request , res = response) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
        return res.status(400).json({
            ok : false ,
            message : 'No hay archivos que subir'
        });
    }


    const { file } = req.files;
    const fileName = file.name.split('.')
    const extension = fileName[ fileName.length - 1 ]
    
// validar extensiones :
    const extensionsValidated = ['png' , 'jpg' , 'jpeg' , 'gif'];
    if( !extensionsValidated.includes((extension)) ){
        return res.status(400).json({
            ok : false ,
            message : ` La extension ${ extension } no es permitida , el servidor solo permite las siguientes extensiones : ${ extensionsValidated } ` 
        })
    }

//    const uploadPath = path.join( __dirname, '../uploads/' , file.name );
//
//    file.mv(uploadPath, (err) => {
//        if (err) {
//            return res.status(500).json({err});
//        }
//
//        res.json({
//            ok : true,
//            message : 'El archivo se ha subido corretamente ' + uploadPath ,
//        });
//    });
    
    
//    console.log(req?.files)
    res.json({
         extension
    })

}

module.exports = {
    uploadFiles
}