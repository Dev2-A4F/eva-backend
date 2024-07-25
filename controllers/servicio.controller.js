const { findUser } = require('../helpers/findUser');
const { generateHour } = require('../helpers/hourGenerate');
const Servicio = require('../models/servicio'); 
const Usuario = require('../models/user')


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


const updateServicio = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedServicio = await Servicio.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedServicio) {
      return res.status(404).json({ msg: 'Service not found' });
    }

    res.json(updatedServicio);
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};

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
  getServicio
};