const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'El campo "nombre" es obligatorio']
  },
  correo: {
    type: String,
    required: [true, 'El campo "correo" es obligatorio'],
    unique: true
  },
  contraseña: {
    type: String,
    required: [true, 'El campo "contraseña" es obligatorio']
  },
  apllido_materno: {
    type: String,
  },
  apllido_paterno: {
    type: String
  },
  dni: {
    type: String
  },
  celular: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: ['CONTADORA', 'CLIENTE', 'ADMIN']
  },
  contadora: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  experiencia: {
    type: String,
  },
  clientes: [{
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  }],
  servicioCliente: {
    type: String,
  }
});

UsuarioSchema.methods.toJSON = function () {
  const { __v, contraseña, _id, ...usuario } = this.toObject();
  usuario.uid = _id;
  return usuario;
}

module.exports = model('Usuario', UsuarioSchema);
