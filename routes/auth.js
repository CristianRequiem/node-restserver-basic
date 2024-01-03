const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const authController = require('../controllers/auth');

const router = Router();

router.post('/login', [
    check('email', 'The e-mail is not valid').isEmail(),
    check('password', 'The password is mandatory').not().isEmpty(),
    validateFields
], authController.login);

router.post('/google', [
    check('id_token', 'id_token is necessary').not().isEmpty(),
    validateFields
], authController.googleSignIn);

module.exports = router;