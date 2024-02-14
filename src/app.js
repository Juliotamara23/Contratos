const express = require('express');
const dbConnection = require('../db/dbConfig.js');
const morgan = require('morgan');
const path = require('path');
const app = express();

//Importación de rutas
const customerRoutes = require('./routes/customer.js');
const getDataCiudadRouter = require('../datos/getDataCiudad.js');
const getDataDepartamentoRouter = require('../datos/getDataDepartamento.js');

// Configuración
const PUERTO = process.env.PORT || 3000;
app.set('view engine', 'ejs');
app.set('view', path.join(__dirname, 'views'));

//middlewares
app.use(morgan('dev'));
//app.use('db/dbConfig', dbConnection);

// Archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

// Rutas para cada uno de los archivos
app.use('/api/datos/getDataDepartamento', getDataDepartamentoRouter);
app.use('/api/datos/getDataCiudad', getDataCiudadRouter);
app.use('/', customerRoutes);

// Inicia el servidor
app.listen(PUERTO, () => {
  console.log(`Servidor ejecutandose en http://localhost:${PUERTO}`);
});