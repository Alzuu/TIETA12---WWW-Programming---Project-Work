const express = require('express');
const usersRoutes = require('./usersRoutes');
const itemsRoutes = require('./itemsRoutes');
const bankAccountsRoutes = require('./bankAccountsRoutes');
const creditCardsRoutes = require('./creditCardsRoutes');

const router = express.Router();

router.use('/users', usersRoutes);
router.use('/items', itemsRoutes);
router.use('/bankaccounts', bankAccountsRoutes);
router.use('/creditcards', creditCardsRoutes);
router.use('/', (req, res) => {
  res.json('API routes');
});

module.exports = router;
