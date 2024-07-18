const { Router } = require('express')
const { check } = require('express-validator')
const { validarCampos } = require('../middlewares/validar-campos')
const { registerPostulante, upload, getPostulantes } = require('../controllers/postulante.controller')
const { userExist } = require('../helpers/db-validators')


const router = Router()

router.post('/', 
  upload.fields([
    { name: 'archivo_cv', maxCount: 1 },
    { name: 'certificado_unico_laboral', maxCount: 1 }
  ]), 
  [
    check('nombre', 'El campo "nombre" es obligatorio').not().isEmpty(),
    check('apellido_materno', 'El campo "apellido_materno" es obligatorio').not().isEmpty(),
    check('apellido_paterno', 'El campo "apellido_paterno" es obligatorio').not().isEmpty(),
    check('dni', 'El campo "dni" es obligatorio').not().isEmpty(),
    check('colegiada', 'El campo "colegiada" es obligatorio').not().isEmpty(),
    check('anio_experiencia', 'El campo "anio_experiencia" es obligatorio').isInt(),
    check('motivacion', 'El campo "motivacion" es obligatorio').not().isEmpty(),
    check('correo', 'El campo "correo" es obligatorio').isEmail(),
    check('correo').custom(userExist),
    check('celular', 'El campo "celular" es obligatorio').not().isEmpty(),
    validarCampos
  ], 
  registerPostulante
);


  router.get("/", [], getPostulantes)



module.exports = router