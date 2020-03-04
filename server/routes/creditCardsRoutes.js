const express = require('express');
const creditCardController = require('../controllers/creditCardController');

const router = express.Router();

router.get('/', creditCardController.listCreditCards);
router.post('/', creditCardController.addCreditCard);
router.get('/:cardId', creditCardController.showCreditCard);
router.put('/:cardId', creditCardController.updateCreditCard);
router.delete('/:cardId', creditCardController.removeCreditCard);

module.exports = router;
