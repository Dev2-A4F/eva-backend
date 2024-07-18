const mongoose = require('mongoose');

const socioSchema = new mongoose.Schema({
  nombreSocio: { type: String, required: true },
  apellidoSocio: { type: String, required: true },
  emailSocio: { type: String, required: true },
  cargoSocio: { type: String, enum: ["Gerente General", "Sub Gerente", "Sin Cargo"], required: true },
  nombresCoFundador: { type: String, required: true },
  apellidosCoFundador: { type: String, required: true },
  tipoDocumento: { type: String, enum: ["DNI", "PAS", "CE", "PTP", "RUC"], required: true },
  numeroDocumento: { type: String, required: true },
  ocupacion: { type: String, required: true },
  nacionalidad: { type: String, required: true },
  telefono: { type: String, required: true },
  nombreZona: { type: String, required: true },
  nombreVia: { type: String, required: true },
  numero: { type: String, required: true },
  kilometro: { type: String, default: null },
  manzana: { type: String, default: null },
  interior: { type: String, default: null },
  Departamento: { type: String, default: null },
  estadoCivil: { type: String, enum: ["Soltero/a", "Casado/a", "Divorciado/a", "Viudo/a"], required: true },
  capitalEfectivo: { type: mongoose.Decimal128, default: null },
  capitalBienes: { type: mongoose.Decimal128, default: null },
  porcentajeParticipacion: { type: mongoose.Decimal128, required: true },
  prestacionLegal_id: { type: mongoose.Schema.Types.ObjectId, ref: 'PrestacionLegal' },
});

const prestacionLegalSchema = new mongoose.Schema({
  nombre1: { type: String, required: true },
  nombre2: { type: String, required: true },
  nombre3: { type: String, required: true },
  nombre4: { type: String, default: null },
  nombre5: { type: String, default: null },
  tipoEmpresa: { type: String, enum: ["SAC", "EIRL"], required: true },
  actividadEmpresa: { type: String, required: true },
  descripcionActividad: { type: String, required: true },
  esSocioDeLaEmpresa: { type: Boolean, required: true, default: false },
  capitalTotal: { type: mongoose.Decimal128, default: null },
  tipoCapital: { type: String, enum: ["Efectivo", "Bienes", "Ambos"], required: true },
  efectivo: { type: mongoose.Decimal128, default: null },
  bienes: { type: mongoose.Decimal128, default: null },
  correoEmpresa: { type: String, required: true },
  telefonoEmpresa: { type: String, required: true },
  direccionFiscal: { type: String, required: true },
  domicilioFiscal: { type: String, enum: ["Alquilado", "Propio"], required: true },
  regimenTributario: { type: String, enum: ["RER", "RMT", "RG"], required: true },
}, {
  timestamps: true,
  collection: 'prestaciones_legales',
});

prestacionLegalSchema.virtual('socios', {
  ref: 'Socio',
  localField: '_id',
  foreignField: 'prestacionLegal_id',
});

const Socio = mongoose.model('Socio', socioSchema);
const PrestacionLegal = mongoose.model('PrestacionLegal', prestacionLegalSchema);

module.exports = { Socio, PrestacionLegal };
