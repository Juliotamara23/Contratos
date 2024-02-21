const express = require('express');
const path = require('path');
//const dbConnection = require(path.join(__dirname, '..', 'db', 'dbConfig.js'));
const morgan = require('morgan');
const app = express();

//Importación de rutas
const customerRoutes = require('./routes/usuarios.js');
const getDataCiudadRouter = require('../datos/getDataCiudad.js');
const getDataDepartamentoRouter = require('../datos/getDataDepartamento.js');

// Configuración
const PUERTO = process.env.PORT || 3000;
app.set('view engine', 'ejs');

//middlewares
app.use(morgan("dev"));
//app.use('db/dbConfig', dbConnection);

// Archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));
app.set('view', path.join(__dirname, 'views', 'usuarios.html'))
app.get('/partials/_header.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'partials', '_header.html'));
});
app.get('/partials/_footer.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'partials', '_footer.html'));
});

// Rutas para cada uno de los archivos
app.use('/api/datos/getDataDepartamento', getDataDepartamentoRouter);
app.use('/api/datos/getDataCiudad', getDataCiudadRouter);
app.use('/', customerRoutes);

// Inicia el servidor
app.listen(PUERTO, () => {
  console.log(`Servidor ejecutandose en http://localhost:${PUERTO}`);
});