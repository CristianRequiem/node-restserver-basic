const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields,
    validateJWT,
    hasRole } = require('../middlewares');
const { isValidRole, checkEmailExists, userExistsById } = require('../helpers/db-validators');
const userController = require('../controllers/user');

const router = Router();

router.get('/', userController.getUser);

router.post('/', [
    check('name', 'The name is obligatory').not().isEmpty(),
    check('password', 'The password must be at least 6 characters long').isLength({ min: 6 }),
    check('email', 'The e-mail is not valid').isEmail(),
    check('email').custom(checkEmailExists),
    check('role').custom(isValidRole),
    validateFields
], userController.postUser);

router.put('/:id', [
    check('id', 'It is not a valid ID').isMongoId(),
    check('id').custom(userExistsById),
    check('role').custom(isValidRole),
    validateFields
], userController.putUser);

router.delete('/:id', [
    validateJWT,
    hasRole('ADMIN_ROLE', 'SALES_ROLE'),
    check('id', 'It is not a valid ID').isMongoId(),
    check('id').custom(userExistsById),
    validateFields
], userController.deleteUser);

module.exports = router;