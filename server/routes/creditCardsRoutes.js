const express = require('express');
const creditCardController = require('../controllers/creditCardController');
const verifyToken = require('../authentication/verifyToken');
const getRole = require('../authentication/getRole');

const router = express.Router();

router.use((req, res, next) => verifyToken(req, res, next));
router.use((req, res, next) => getRole(req, res, next));
router.get('/', creditCardController.listCreditCards);
router.post('/', creditCardController.addCreditCard);
router.get('/:cardId', creditCardController.showCreditCard);
router.put('/:cardId', creditCardController.updateCreditCard);
router.delete('/:cardId', creditCardController.removeCreditCard);

module.exports = router;
