const jwt = require('jsonwebtoken')

const generarJWT = ( uid = '' ) => {

  return new Promise( (resolve, reject ) => {

    const payload = { uid } 

    jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
      expiresIn: '16h'
    }, ( err, token ) => {

      if( err ){
        console.log( err )
        reject( 'No se pudo generar el JWT' )
      }else {
        resolve( token )
      }
    })


  } )
}

const verificarJWT = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRETORPRIVATEKEY, (err, decoded) => {
      if (err) {
        reject('Token no válido');
      } else {
        resolve(decoded);
      }
    });
  });
};


module.exports = {
  generarJWT,
  verificarJWT
}