const { Router } = require('express');
const { check } = require('express-validator');
const { validateJWT, validateFields, isAdminRole } = require('../middlewares');
const { checkCategoryExists, checkProductExists } = require('../helpers/db-validators');
const productController = require('../controllers/product');

const router = Router();

router.get('/', [
    validateJWT
], productController.getProducts);

router.get('/:id', [
    validateJWT,
    check('id', 'The ID must be a valid mongo ID').isMongoId(),
    check('id').custom(checkProductExists),
    validateFields
], productController.getProductByID);

router.post('/', [
    validateJWT,
    check('name', 'The name is mandatory').not().isEmpty(),
    check('description', 'The description is mandatory').not().isEmpty(),
    check('category', 'The category must be a valid mongo ID').isMongoId(),
    check('category').custom(checkCategoryExists),
    validateFields
], productController.createProduct);

router.put('/:id', [
    validateJWT,
    check('id', 'The ID must be a valid mongo ID').isMongoId(),
    check('id').custom(checkProductExists),
    check('name', 'The name is mandatory').not().isEmpty(),
    check('description', 'The description is mandatory').not().isEmpty(),
    check('category', 'The category must be a valid mongo ID').isMongoId(),
    check('category').custom(checkCategoryExists),
    validateFields
], productController.updateProduct);

router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'The ID must be a valid mongo ID').isMongoId(),
    check('id').custom(checkProductExists),
    validateFields
], productController.deleteProduct);

module.exports = router;