const express = require('express');
const router = express.Router();

const urlController = require('../controllers/urlController');

router.post('/url/shorten', urlController.createshorturl);
router.get('/:urlCode', urlController.getredirecturl);

module.exports = router;