const express = require('express');
const router = express.Router();
const todoController = require('./controllers/todo-controller');

router.get('/', todoController.home);

router.post('/create-item', todoController.create);

router.post('/update-item', todoController.update);

router.post('/delete-item', todoController.delete);

module.exports = router;