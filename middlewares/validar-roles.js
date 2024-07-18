const { response, request } = require("express")

const esAdminRole = ( req = request, res = response, next) => {

  if ( !req.user ) {
    return res.status(500).json({
      msg: 'Se quiere verificar el role sin validar el token primero'
    })
  }

  const { rol, nombre } = req.user;

  if( rol != 'ADMIN_ROLE') {
    return res.status(401).json({
      msg: `El ${ nombre } no es administrador - No esta permitido`
    })
  }

  next()
}

module.exports = {
  esAdminRole
}