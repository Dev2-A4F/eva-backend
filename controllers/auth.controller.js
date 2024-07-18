const { response } = require("express");
const Usuario = require('../models/user')
const bcryptjs = require('bcryptjs');
const { generarJWT, verificarJWT } = require("../helpers/generarJWT");

const login = async(req, res = response) => {

  const { correo, contraseña } = req.body

  try {

    //Verificar si el email existe

    const usuario = await Usuario.findOne( { correo } )

    if ( !usuario ) {
      return res.status(400).json({
        msg: 'Usuario / Contraseña no son correctos - Usuario'
      })
    }

    // Verificar la contraseña

    const validPassword = bcryptjs.compareSync( contraseña, usuario.contraseña )

    if( !validPassword ) {
      return res.status(400).json({
        msg: 'Usuario / Contraseña no son correctos - Password'
      })
    }

    //Generar el JWT

    const token = await generarJWT( usuario.id )

    res.json({
      usuario, token
    })
    
  } catch (error) {

    console.log(error)
    res.status(500).json({
      msg: 'Ocurrió un error'
    })
  }
}

const refreshToken = async (req, res = response) => {
  const { token } = req.body;

  try {
    // Verificar el token actual y extraer el uid
    const { uid } = await verificarJWT(token);

    // Verificar si el usuario aún existe
    const usuario = await Usuario.findById(uid);

    if (!usuario) {
      return res.status(404).json({
        msg: 'No se encontró el usuario asociado al token'
      });
    }

    // Generar un nuevo token
    const newToken = await generarJWT(usuario.id);

    res.json({
      usuario,
      token: newToken
    });

  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: 'Token no válido o expirado'
    });
  }
};



module.exports = {
  login,
  refreshToken
}