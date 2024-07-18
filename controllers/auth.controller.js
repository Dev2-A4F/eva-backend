const { response } = require("express");
const Usuario = require('../models/user')
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generarJWT");

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


module.exports = {
  login
}