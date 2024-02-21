const express = require('express');
const router = express.Router();
const customerController = require('../controllers/usuarioController.js')

router.get('/', customerController.list);

module.exports = router;