const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields, validateJWT, isAdminRole } = require('../middlewares');
const { checkCategoryExists } = require('../helpers/db-validators');
const categoryController = require('../controllers/category');

const router = Router();

router.get('/', [
    validateJWT
], categoryController.getCategories);

router.get('/:id', [
    validateJWT,
    check('id', 'ID must be a valid mongo ID').isMongoId(),
    check('id').custom(checkCategoryExists),
    validateFields
], categoryController.getCategoryByID);

router.post('/', [
    validateJWT,
    check('name', 'The name is mandatory').not().isEmpty(),
    validateFields
], categoryController.createCategory);

router.put('/:id', [
    validateJWT,
    check('id', 'ID must be a valid mongo ID').isMongoId(),
    check('id').custom(checkCategoryExists),
    check('name', 'The name is mandatory').not().isEmpty(),
    validateFields
], categoryController.updateCategory);

router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'ID must be a valid mongo ID').isMongoId(),
    check('id').custom(checkCategoryExists),
    validateFields
], categoryController.deleteCategory);

module.exports = router;