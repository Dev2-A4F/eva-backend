const Usuario = require('../models/user');

async function verificarUnicidad({ email, username, phone, id }) {
  // Comprobar si el email fue proporcionado y buscar si ya está en uso
  if (email !== undefined) {
    const existeCorreo = await Usuario.findOne({ email, _id: { $ne: id } });
    if (existeCorreo) {
      return 'El email ya está en uso por otro usuario';
    }
  }

  // Comprobar si el username fue proporcionado y buscar si ya está en uso
  if (username !== undefined) {
    const existeUsername = await Usuario.findOne({ username, _id: { $ne: id } });
    if (existeUsername) {
      return 'El nombre de usuario ya está en uso por otro usuario';
    }
  }

  // Comprobar si el phone fue proporcionado y buscar si ya está en uso
  if (phone !== undefined) {
    const existePhone = await Usuario.findOne({ phone, _id: { $ne: id } });
    if (existePhone) {
      return 'El teléfono ya está en uso por otro usuario';
    }
  }

  // Si no hay conflictos, retorna null
  return null;
}

module.exports = {
  verificarUnicidad
};
