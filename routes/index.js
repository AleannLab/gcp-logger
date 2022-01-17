const express = require('express');
const loggerView = require('../views/loggerView');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/log', loggerView)

module.exports = router;
