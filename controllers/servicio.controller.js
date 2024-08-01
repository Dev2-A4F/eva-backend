const multer = require('multer');
const { findUser } = require('../helpers/findUser');
const { generateHour } = require('../helpers/hourGenerate');
const Servicio = require('../models/servicio'); 
const Usuario = require('../models/user')
const cloudinary = require('../config/cloudinary');
const { response } = require('express');


const inicioServicio = async (req, res) => {
  const id = req.params.id;  // Recibe el ID desde los parámetros de la URL
  const { fecha, hora } = req.body;

  console.log(id)

  try {
    const user = await Usuario.findById(id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const newServicio = new Servicio({
      linkReunion: "https://example.com/meeting",
      cliente_id: user._id,
      fecha: fecha,
      hora: hora,
      fecha_creacion: generateHour()
    });

    await newServicio.save();

    user.servicioCliente = newServicio._id;
    await user.save();

    res.json(newServicio);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};


// Configuración de multer para manejar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Función para subir archivos a Cloudinary desde un buffer
const uploadToCloudinary = (fileBuffer, folder, filename) => {
  return new Promise((resolve, reject) => {
    const upload_stream = cloudinary.uploader.upload_stream({ folder: folder, public_id: filename.trim(), resource_type: 'raw' }, (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    require('streamifier').createReadStream(fileBuffer).pipe(upload_stream);
  });
};

const updateServicio = async (req, res = response) => {
  const { id } = req.params;
  const { files, ...updates } = req.body;

  try {
    // Almacenar la información de los archivos
    let uploadedFiles = [];

    // Iterar sobre el array de archivos y procesar el base64
    if (files && files.length > 0) {
      for (const file of files) {
        const { name, base64 } = file;
        const fileBuffer = Buffer.from(base64, 'base64');
        const result = await uploadToCloudinary(fileBuffer, 'servicios', name);
        uploadedFiles.push({
          name: name,
          url: result.secure_url
        });
      }
    }

    // Actualizar el servicio con la nueva información
    if (uploadedFiles.length > 0) {
      updates.files = uploadedFiles;
    }

    const updatedServicio = await Servicio.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedServicio) {
      return res.status(404).json({ msg: 'Service not found' });
    }

    res.json(updatedServicio);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Server error', error });
  }
};;

const getServicio = async (req, res) => {
  const { id } = req.params;

  try {
    const servicio = await Servicio.findById(id)

    if(!servicio) {
      res.status(404).json({ msg: 'No se encontró este servicio' });
    }

    res.json(servicio);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};

module.exports = {
  inicioServicio,
  updateServicio,
  getServicio,
  upload
};