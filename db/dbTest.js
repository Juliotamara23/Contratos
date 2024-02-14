const connection = require('./dbConfig.js');

connection.query('SELECT * FROM usuarios', (err, results) => {
  if (err) {
    console.error('Error al ejecutar la consulta:', err);
  } else {
    console.log('Usuarios:', results);
  }
});

// Cierra la conexión cuando hayas terminado de utilizarla
connection.end();