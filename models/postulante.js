const { Schema, model } = require('mongoose');

const PostulanteSchema = Schema({
  nombre: {
    type: String,
    required: [true, 'El campo "nombre" es obligatorio']
  },
  apellido_materno: {
    type: String,
    required: [true, 'El campo "apellido_materno" es obligatorio']
  },
  apellido_paterno: {
    type: String,
    required: [true, 'El campo "apellido_paterno" es obligatorio']
  },
  dni: {
    type: String,
    required: [true, 'El campo "dni" es obligatorio']
  },
  colegiada: {
    type: Boolean,
    required: [true, 'El campo "colegiada" es obligatorio']
  },
  anio_experiencia: {
    type: Number,
    required: [true, 'El campo "anio_experiencia" es obligatorio']
  },
  motivacion: {
    type: String,
    required: [true, 'El campo "motivacion" es obligatorio']
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
  celular: {
    type: String,
    required: [true, 'El campo "celular" es obligatorio']
  },
  archivo_cv: {
    type: String,
    required: [true, 'El campo "archivo_cv" es obligatorio']
  },
  certificado_unico_laboral: {
    type: String,
    required: [true, 'El campo "certificado_unico_laboral" es obligatorio']
  }
});

// Función que reescribe el método toJSON del express validator, esto lo hacemos para excluir el __v y la contraseña, y que esta no sea visible al hacer consultas
PostulanteSchema.methods.toJSON = function () {
  const { __v, contraseña, _id, ...postulante } = this.toObject();
  postulante.uid = _id;
  return postulante;
}

module.exports = model('Postulante', PostulanteSchema);
