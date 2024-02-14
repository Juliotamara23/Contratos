const express = require('express');
const router = express.Router();
const https = require('https');
const fs = require('fs');
const path = require('path');

//Función para obtener y filtrar datos del departamento desde una URL JSON
const getDataDepartamento = (jsonUrl) => {
  return new Promise((resolve, reject) => {
    https.get(jsonUrl, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          const filteredData = jsonData.map(({ id, departamento }) => ({ id, departamento }));
          resolve(filteredData);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
};

// Función para servir archivos estáticos desde el sistema de archivos
const serveStaticFile = (req, res) => {
  const filePath = path.join(__dirname, req.url);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Archivo no encontrado');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    }
  });
};

// Definición de la ruta principal '/'
router.get('/', async (req, res) => {
  const jsonUrl = 'https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json';

  try {
    const filteredJsonData = await getDataDepartamento(jsonUrl);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ getDataDepartamento: filteredJsonData }));
  } catch (error) {
    console.error('Error al obtener o parsear el JSON:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error interno del servidor');
  }
});

module.exports = router;