const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const getJsonFromUrl = (jsonUrl) => {
  return new Promise((resolve, reject) => {
    https.get(jsonUrl, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
};

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

const server = http.createServer(async (req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    const jsonUrl = 'https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json';

    try {
      const jsonData = await getJsonFromUrl(jsonUrl);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(jsonData));
    } catch (error) {
      console.error('Error al obtener o parsear el JSON:', error);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Error interno del servidor');
    }
  } else {
    serveStaticFile(req, res);
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
