const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { inicioServicio } = require("../controllers/servicio.controller");
const { validarJWT } = require("../middlewares/validar-jwt");
const { createPrestacionLegal, getPrestacionesLegales, getPrestacionLegal, actualizarPrestacionLegal, eliminarPrestacionLegal } = require("../controllers/prestacion");


const router = Router()

router.post('/socio', [
  validarJWT,
  check('fecha', 'La fecha es obligatoria').not().isEmpty(),
  check('hora', 'La hora es obligatoria').not().isEmpty(),
  validarCampos
], inicioServicio )

router.post("/createPrestacionLegal", createPrestacionLegal)
router.get("/getPrestacionesLegales", getPrestacionesLegales)
router.get("/getPrestacionLegal/:id?", getPrestacionLegal)
router.put("/actualizarPrestacionLegal/:id?", actualizarPrestacionLegal)
router.delete("/eliminarPrestacionLegal/:id?", eliminarPrestacionLegal)


module.exports = router;
