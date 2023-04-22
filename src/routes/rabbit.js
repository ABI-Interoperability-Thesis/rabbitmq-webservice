const express = require('express');
const router = express.Router();
const rabbitController = require('../controllers/rabbit')

router.get('/url', rabbitController.GetURL)
router.post('/message', rabbitController.PostMessageToRabbitMQ)
module.exports = router;