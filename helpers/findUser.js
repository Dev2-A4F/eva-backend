const jwt = require('jsonwebtoken');
const Usuario = require('../models/user'); // Asegúrate de que la ruta sea correcta para tu modelo de Mongoose

const findUser = async (token) => {
  try {
    // Verifica el token utilizando tu 'secret' o 'clave' con la que firmaste los JWTs
    const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // Asumiendo que el ID del usuario está en el payload del token como 'usuarioId'
    const usuarioId = decoded.uid;


    // Buscar el usuario en la base de datos
    const usuario = await Usuario.findById(usuarioId);

    if (!usuario) {
      return null; // O manejar como prefieras cuando el usuario no se encuentra
    }

    return usuario; // Devuelve el usuario encontrado
  } catch (error) {
    console.error(error);
    throw new Error("Error al verificar el token o buscar el usuario.");
  }
};


module.exports = {
  findUser
}