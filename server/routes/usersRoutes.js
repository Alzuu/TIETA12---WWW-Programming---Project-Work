const express = require('express');

const router = express.Router();

router.get('/');
router.post('/');
router.get('/:id');
router.put('/:id');
router.delete('/:id');
router.get('/:id/items');
router.post('/login');
router.post('/logout');

module.exports = router;
