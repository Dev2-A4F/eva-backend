const { Socio, PrestacionLegal } = require("../models/prestacion");

const createPrestacionLegal = async (req, res) => {
  const { socios, ...prestacionLegalData } = req.body;

  try {
    const prestacionLegal = new PrestacionLegal(prestacionLegalData);
    await prestacionLegal.save();

    if (socios && socios.length > 0) {
      const sociosData = socios.map(socio => ({
        ...socio,
        prestacionLegal_id: prestacionLegal._id,
      }));
      await Socio.insertMany(sociosData);
    }

    const prestacionLegal_Socios = await PrestacionLegal.findById(prestacionLegal._id).populate('socios');
    res.status(201).json({
      status: "success",
      prestacionLegal: prestacionLegal_Socios,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al crear la prestación legal",
      errorMessage: error.message,
      stack: error.stack,
      error,
    });
  }
};

const getPrestacionesLegales = async (req, res) => {
  try {
    const prestacionesLegales = await PrestacionLegal.find().populate('socios');
    res.status(200).json({
      status: "success",
      cantidad: prestacionesLegales.length,
      prestacionesLegales,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener las prestaciones legales",
      errorMessage: error.message,
      stack: error.stack,
      error,
    });
  }
};

const getPrestacionLegal = async (req, res) => {
  try {
    const prestacionLegal = await PrestacionLegal.findById(req.params.id).populate('socios');
    res.status(200).json({
      status: "success",
      prestacionLegal,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al obtener la prestacion legal",
      errorMessage: error.message,
      stack: error.stack,
      error,
    });
  }
};

const actualizarPrestacionLegal = async (req, res) => {
  try {
    const prestacionLegal = await PrestacionLegal.findById(req.params.id);
    if (!prestacionLegal) {
      return res.status(404).json({
        status: "error",
        message: "Prestacion legal no encontrada",
      });
    }
    const prestacionLegalActualizada = await prestacionLegal.updateOne(req.body);
    res.status(200).json({
      status: "success",
      prestacionLegal: prestacionLegalActualizada,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al actualizar la prestacion legal",
      errorMessage: error.message,
      stack: error.stack,
      error,
    });
  }
};

const eliminarPrestacionLegal = async (req, res) => {
  try {
    const prestacionLegal = await PrestacionLegal.findById(req.params.id);
    if (!prestacionLegal) {
      return res.status(404).json({
        status: "error",
        message: "Prestacion legal no encontrada",
      });
    }
    await prestacionLegal.deleteOne();
    res.status(200).json({
      status: "success",
      message: "Prestacion legal eliminada correctamente",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error al eliminar la prestacion legal",
      errorMessage: error.message,
      stack: error.stack,
      error,
    });
  }
};


module.exports = {
  createPrestacionLegal,
  getPrestacionesLegales,
  getPrestacionLegal,
  actualizarPrestacionLegal,
  eliminarPrestacionLegal
}