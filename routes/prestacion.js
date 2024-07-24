const router = require("express").Router();
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { createPrestacionLegal, getPrestacionesLegales, getPrestacionLegalById, updatePrestacionLegal, deletePrestacionLegal } = require("../controllers/prestacion.controller");


router.get("/getPrestacionesLegales", getPrestacionesLegales);
router.get("/getPrestacionLegal/:id", getPrestacionLegalById);
router.delete("/eliminarPrestacionLegal/:id", deletePrestacionLegal);

router.put("/actualizarPrestacionLegal/:id",
  [
    check("id", "El ID debe ser válido").isMongoId(),
    check("nombre1", "El nombre1 es obligatorio").not().isEmpty(),
    check("nombre2", "El nombre2 es obligatorio").not().isEmpty(),
    check("nombre3", "El nombre3 es obligatorio").not().isEmpty(),
    check("tipoEmpresa", "El tipo de empresa es obligatorio").isIn(["SAC", "EIRL"]),
    check("actividadEmpresa", "La actividad de la empresa es obligatoria").not().isEmpty(),
    check("descripcionActividad", "La descripción de la actividad es obligatoria").not().isEmpty(),
    check("tipoCapital", "El tipo de capital es obligatorio").isIn(["Efectivo", "Bienes", "Ambos"]),
    check("correoEmpresa", "El correo de la empresa es obligatorio").isEmail(),
    check("telefonoEmpresa", "El teléfono de la empresa es obligatorio").not().isEmpty(),
    check("direccionFiscal", "La dirección fiscal es obligatoria").not().isEmpty(),
    check("domicilioFiscal", "El domicilio fiscal es obligatorio").isIn(["Alquilado", "Propio"]),
    check("regimenTributario", "El régimen tributario es obligatorio").isIn(["RER", "RMT", "RG"]),
    validarCampos,
  ],
  updatePrestacionLegal
);


router.post("/createPrestacionLegal",
  [
    check("nombre1", "El nombre1 es obligatorio").not().isEmpty(),
    check("nombre2", "El nombre2 es obligatorio").not().isEmpty(),
    check("nombre3", "El nombre3 es obligatorio").not().isEmpty(),
    check("tipoEmpresa", "El tipo de empresa es obligatorio").isIn(["SAC", "EIRL"]),
    check("actividadEmpresa", "La actividad de la empresa es obligatoria").not().isEmpty(),
    check("descripcionActividad", "La descripción de la actividad es obligatoria").not().isEmpty(),
    check("tipoCapital", "El tipo de capital es obligatorio").isIn(["Efectivo", "Bienes", "Ambos"]),
    check("correoEmpresa", "El correo de la empresa es obligatorio").isEmail(),
    check("telefonoEmpresa", "El teléfono de la empresa es obligatorio").not().isEmpty(),
    check("direccionFiscal", "La dirección fiscal es obligatoria").not().isEmpty(),
    check("domicilioFiscal", "El domicilio fiscal es obligatorio").isIn(["Alquilado", "Propio"]),
    check("regimenTributario", "El régimen tributario es obligatorio").isIn(["RER", "RMT", "RG"]),
    validarCampos,
  ],
  createPrestacionLegal
);

module.exports = router;
