const { Schema , model } = require('mongoose');


const UsuarioSchema = new Schema({
    
    nombre : {
        type: String,
        required : [true , 'el nombre es obligatorio']
    },

    correo : {
        type: String,
        required : [true , 'el correo es obligatorio'],
        unique : true
    },

    password : {
        type: String,
        required : [true , 'el password es obligatorio']
    },

    img : {
        type: String,
        default : ''
    },
    
    estado : {
        type: Boolean,
        default : true
    },

    google : {
        type: Boolean,
        default : false
    }
})


UsuarioSchema.methods.toJSON = function(){
    const { __v , password , _id ,...user } = this.toObject();
    user.uid = _id
    return  user ;
}

module.exports = model('Usuario' , UsuarioSchema); 