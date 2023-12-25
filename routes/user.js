const { Router } = require('express');
const userController = require('../controllers/user');

const router = Router();

router.get('/', userController.getUser);

router.post('/', userController.postUser);

router.put('/:id', userController.putUser);

router.delete('/', userController.deleteUser);

module.exports = router;