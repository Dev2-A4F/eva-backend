const generateHour = () => {
    // Definir la zona horaria de Lima, Perú
    const zonaHorariaLima = 'America/Lima';

    // Obtener la fecha y hora actual en la zona horaria de Lima
    const ahoraLima = new Date().toLocaleString('es-PE', { timeZone: zonaHorariaLima });

    return ahoraLima;
}

module.exports = {
    generateHour
  }