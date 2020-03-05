const express = require('express');
const bankAccountController = require('../controllers/bankAccountController');
const getRole = require('../authentication/getRole');
const verifyToken = require('../authentication/verifyToken');

const router = express.Router();

router.use((req, res, next) => verifyToken(req, res, next));
router.use((req, res, next) => getRole(req, res, next));
router.get('/', bankAccountController.listBankAccounts);
router.post('/', bankAccountController.addBankAccount);
router.get('/:bankAccountId', bankAccountController.showBankAccount);
router.put('/:bankAccountId', bankAccountController.updateBankAccount);
router.delete('/:bankAccountId', bankAccountController.removeBankAccount);

module.exports = router;
