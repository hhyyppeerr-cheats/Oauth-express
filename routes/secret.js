const express = require('express');
const { ensureAuthenticated } = require('../middlewares/auth');
const router = express.Router();

router.get('/', ensureAuthenticated, (req, res) => {
  res.send('Secretitos solo disponibles para usuarios autenticados');
});

module.exports = router;
