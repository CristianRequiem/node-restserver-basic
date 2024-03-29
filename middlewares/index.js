const validateFields = require('../middlewares/validate-fields');
const validateFile = require('../middlewares/validate-file');
const validateJWT = require('../middlewares/validate-jwt');
const validateRoles = require('../middlewares/validate-role');

module.exports = {
    ...validateFields,
    ...validateFile,
    ...validateJWT,
    ...validateRoles
}