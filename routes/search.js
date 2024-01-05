const { Router } = require('express');
const searchController = require('../controllers/search');

const router = Router();

router.get('/:collection/:term', searchController.search);

module.exports = router;