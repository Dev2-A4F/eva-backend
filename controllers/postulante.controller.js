const { response } = require("express");
const Postulante = require("../models/postulante");
const bcryptjs = require("bcryptjs");
const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");
const path = require('path');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadToCloudinary = (fileBuffer, originalName, folder, filename) => {
  return new Promise((resolve, reject) => {
    const extension = path.extname(originalName); // Obtiene la extensión del archivo
    const public_id = `${filename.trim()}${extension}`; // Incluye la extensión en el nombre público

    const upload_stream = cloudinary.uploader.upload_stream(
      { folder: folder, public_id: public_id, resource_type: "raw" },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(upload_stream);
  });
};

const registerPostulante = async (req, res = response) => {
  const {
    nombre,
    apellido_materno,
    apellido_paterno,
    dni,
    colegiada,
    anio_experiencia,
    motivacion,
    correo,
    password,
    celular,
  } = req.body;

  let contraseña = password;

  try {
    const archivo_cv_result = await uploadToCloudinary(
      req.files["archivo_cv"][0].buffer,
      req.files["archivo_cv"][0].originalname, // Pasa el nombre original del archivo
      "archivo",
      `Archivo_${nombre.trim()}_${apellido_paterno.trim()}`
    );
    const certificado_unico_laboral_result = await uploadToCloudinary(
      req.files["certificado_unico_laboral"][0].buffer,
      req.files["certificado_unico_laboral"][0].originalname, // Pasa el nombre original del archivo
      "certificados",
      `Certificado_${nombre.trim()}_${apellido_paterno.trim()}`
    );

    const archivo_cv = archivo_cv_result.secure_url;
    const certificado_unico_laboral =
      certificado_unico_laboral_result.secure_url;

    const postulante = new Postulante({
      nombre,
      apellido_materno,
      apellido_paterno,
      dni,
      colegiada,
      anio_experiencia,
      motivacion,
      correo,
      contraseña,
      celular,
      archivo_cv,
      certificado_unico_laboral,
    });

    const salt = bcryptjs.genSaltSync();
    postulante.contraseña = bcryptjs.hashSync(contraseña, salt);

    await postulante.save();

    res.json({
      msg: "Postulante registrado exitosamente",
      postulante,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error de servidor",
    });
  }
};

const getPostulantes = async (req, res = response) => {
  try {
    const postulantes = await Postulante.find();
    res.json({
      total: postulantes.length,
      usuarios: postulantes,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error de Servidor",
    });
  }
};

module.exports = {
  registerPostulante,
  upload,
  getPostulantes,
};