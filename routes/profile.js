const express = require('express');
const { ensureAuthenticated } = require('../middlewares/auth');
const router = express.Router();

router.get('/', ensureAuthenticated, (req, res) => {
  res.json(req.user);
});

module.exports = router;
