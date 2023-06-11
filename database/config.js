const mongoose = require('mongoose');

const dbConection = async () => {

    try{

        await mongoose.connect(process.env.MONGO_CNN);
        console.log('La base de datos ha sido conectada');

    }catch(e){
        console.log(e);
        throw new Error('Error en la conección en la base de datos');
    }

}

module.exports = {
    dbConection
};