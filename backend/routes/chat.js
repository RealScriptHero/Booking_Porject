const express = require('express');
const router = express.Router();
const { chatWithAssistant } = require('../controllers/chatController');

router.post('/', chatWithAssistant);

module.exports = router;
