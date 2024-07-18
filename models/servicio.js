const { Schema, model } = require('mongoose');

const ServicioSchema = Schema({
  linkReunion: {
    type: String,
    default: ""
  },
  labelFiles: {
    type: [String],
  },
  files: {
    type: [String],
    default: []
  },
  titulo: {
    type: String,
    default: ""
  },
  descripcion: {
    type: String,
    default: ""
  },
  documentContadora: {
    type: String,
    default: ""
  },
  paso: {
    type: [Number],
    default: 1
  },
  state: {
    type: [String],
    enum: ["FINALIZADO", "PENDIENTE"],
    default: ["PENDIENTE"]
  },
  cliente_id: {
    type: String,
    default: ""
  },
  fecha: {
    type: String,
    default: ""
  },
  hora: {
    type: String,
    default: ""
  }
});

ServicioSchema.methods.toJSON = function () {
  const { __v, _id, ...usuario } = this.toObject();
  usuario.uid = _id;
  return usuario;
}

module.exports = model('Servicio', ServicioSchema);
