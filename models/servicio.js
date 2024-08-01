const { Schema, model } = require('mongoose');

const ServicioSchema = Schema({
  linkReunion: {
    type: String,
    default: ""
  },
  labelFiles: {
    type: [String],
  },
  files: [
    {
      name: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      }
    }
  ],
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
    type: Number,
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
  },
  fecha_creacion: {
    type: String,
  }
});

ServicioSchema.methods.toJSON = function () {
  const { __v, _id, ...servicio } = this.toObject();
  servicio.uid = _id;
  return servicio;
}

module.exports = model('Servicio', ServicioSchema);
