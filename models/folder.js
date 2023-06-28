const { Schema , model } = require('mongoose');

const FolderSchema = new Schema({

    nombre : {
        type: String,
        required : [true , 'es necesario añadir un nombre'],
        unique : true
    },

    imagenes : {
        type : Array,
        default :[]
    },

    usuario :{
        type : Schema.Types.ObjectId,
        ref : 'Usuario',
        required : true 
    }
})

FolderSchema.methods.toJSON = function(){
    const { __v , ...folder } = this.toObject();
    
    return folder ;
}


module.exports = model('Folder' , FolderSchema)