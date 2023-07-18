const jwt = require('jsonwebtoken');

const generarJWT = ( uid = '' ) => {

    return new Promise( ( resolve , reject ) => {

        const payload = { uid }

        //? firmar el token 
        jwt.sign(payload , process.env.SECRETORPRIVATEKEY ,  {expiresIn : '6h'},(err , token) =>{
            if(err){
                console.log(err)
                reject('No se pudo generar el token');
            }else{
                resolve(token)
            }
        })
    } )

}

module.exports = {
    generarJWT
}