const express = require('express');
const getDataCiudadRouter = require('./routers/getDataCiudad.js');
const getDataDepartamentoRouter = require('./routers/getDataDepartamento.js');

const app = express();
const PORT = 3000;

// Rutas para cada uno de los archivos
app.use('/api/routers/getDataDepartamento', getDataDepartamentoRouter);
app.use('/api/routers/getDataCiudad', getDataCiudadRouter);

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});