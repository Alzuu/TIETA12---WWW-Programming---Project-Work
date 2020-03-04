const express = require('express');
const bankAccountController = require('../controllers/bankAccountController');

const router = express.Router();

router.get('/', bankAccountController.listBankAccounts);
router.post('/', bankAccountController.addBankAccount);
router.get('/:bankAccountId', bankAccountController.showBankAccount);
router.put('/:bankAccountId', bankAccountController.updateBankAccount);
router.delete('/:bankAccountId', bankAccountController.removeBankAccount);

module.exports = router;
