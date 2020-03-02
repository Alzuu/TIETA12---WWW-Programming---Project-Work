const express = require('express');

const router = express.Router();

router.get('/');
router.post('/');
router.get('/:id');
router.put('/:id');
router.delete('/:id');
router.put('/:id/sell/:userid');

module.exports = router;
