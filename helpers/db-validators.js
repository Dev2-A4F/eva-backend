const Usuario = require("../models/user")
const Role = require("../models/role")


const validateRole = async(role = '') => {
  //Verificacion de que si el ROL existe en nuestra DB de roles, sino existe manda un error.
  const existRole = await Role.findOne( { role } )
  if ( !existRole ){
    throw new Error(`El rol ${ role } no está registrado en la Base de Datos`)
  }
}

const emailExist = async( correo ) => {
  if( !correo || correo === null ) { 
    return true 
  }

  const emailExist = await Usuario.findOne( { correo } )
  if ( emailExist ) {
    throw new Error(`El correo ${email} ya está registrado`)
  }
}

const userExist = async( correo = "" ) => {
  //Verificar si el correo existe
  
  const userExist = await Usuario.findOne( { correo } )
  if ( userExist ) {
    throw new Error(`El usuario ${correo} ya está registrado`)
  }
}

const phoneExist = async( phone = "" ) => {

  if( !phone || phone === null ) { 
    return true 
  }

  //Verificar si el correo existe
  const phoneExist = await Usuario.findOne( { phone } )
  if ( phoneExist ) {
    throw new Error(`El teléfono ${phone} ya está registrado`)
  }
}

const rucExist = async( ruc ) => {
  if( !ruc ) { 
    return true 
  }

  const rucExist = await Usuario.findOne( { ruc } )
  if ( rucExist ) {
    throw new Error(`El RUC ${ruc} ya está registrado`)
  }
}

const codeExist = async( code ) => {
  if( !code ) { 
    return true 
  }

  const codeExist = await Usuario.findOne( { code } )
  if ( !codeExist ) {
    throw new Error(`El Codigo ${code} no existe`)
  } else {
    return true 
  }
}


module.exports = {
  emailExist,
  validateRole,
  userExist,
  phoneExist,
  rucExist,
  codeExist
}