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
app.use(express.urlencoded({extended: false}));

// Archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));
app.set('view', path.join(__dirname, 'views', 'usuarios.html'))

const partialsRoutes = ['/partials/_header.html', '/partials/_footer.html', '/partials/_header_footer.js'];

app.get(partialsRoutes, (req, res) => {
  const requestedPath = req.url;

  // Verificar si la ruta solicitada está en el arreglo de rutas permitidas
  if (partialsRoutes.includes(requestedPath)) {
    // Construir la ruta completa al archivo y enviarlo
    res.sendFile(path.join(__dirname, 'views', requestedPath));
  } else {
    // Si la ruta no está permitida, devolver un código de estado 404 (Not Found)
    res.status(404).send('Not Found');
  }
});

// Rutas para cada uno de los archivos
app.use('/api/datos/getDataDepartamento', getDataDepartamentoRouter);
app.use('/api/datos/getDataCiudad', getDataCiudadRouter);
app.use('/', customerRoutes);

// Inicia el servidor
app.listen(PUERTO, () => {
  console.log(`Servidor ejecutandose en http://localhost:${PUERTO}`);
});