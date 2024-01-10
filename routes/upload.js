const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields, validateFileToUpload } = require('../middlewares');
const { allowedCollections } = require('../helpers');
const uploadController = require('../controllers/upload');

const router = Router();

router.post('/', validateFileToUpload, uploadController.uploadFile);

router.put('/:collection/:id', [
    validateFileToUpload,
    check('id', 'ID must be a valid mongo ID').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['user', 'product'])),
    validateFields
], uploadController.updateImageCloudinary);

router.get('/:collection/:id', [
    check('id', 'ID must be a valid mongo ID').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['user', 'product'])),
    validateFields
], uploadController.showImageCloudinary);

module.exports = router;