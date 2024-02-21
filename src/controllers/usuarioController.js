const path = require('path');
const connection = require(path.join(__dirname, '..', '..', 'db', 'dbConfig.js'));
const controller = {};

controller.list = (req, res) => {
    connection.query('SELECT * FROM usuarios', (err, usuarios) => {
        if (err) {
            console.error('Error al ejecutar la consulta:', err);
            res.status(500).send('Error interno del servidor');
        } else {
            //console.log(usuarios);
            res.sendFile(path.join(__dirname, '..','views','usuarios.html'));
        }
        // Cierra la conexión cuando hayas terminado de utilizarla
        //connection.end();
    });
};

module.exports = controller;