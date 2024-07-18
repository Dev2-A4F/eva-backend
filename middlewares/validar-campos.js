const { validationResult } = require("express-validator")


  const validarCampos = ( req, res, next ) => {

    const errors = validationResult( req )
    if( !errors.isEmpty() ){
      return res.status(400).json( errors )
    }

    //Si llega este punto, seguirá con el siguiente middleware, es decir, si no hay errores sigue.
    next()
  }

  module.exports = {
    validarCampos
  }