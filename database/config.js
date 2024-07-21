const mongoose = require("mongoose");

const dbConnection = async () => {
  console.log("Conectando a la DB...");
  try {
    await mongoose.connect(process.env.MONGODB_CNN);
    console.log("Conexión a la DB exitosa");
  } catch (error) {
    console.error("Error durante la conexión:", error);
    throw new Error("Error al iniciar la base de datos");
  }
};

module.exports = { dbConnection };
