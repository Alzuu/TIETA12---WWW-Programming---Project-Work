const express = require('express');
const itemController = require('../controllers/itemController');
const verifyToken = require('../authentication/verifyToken');
const getRole = require('../authentication/getRole');
const router = express.Router();

router.get('/customers', itemController.listCustomersItems);
router.use((req, res, next) => verifyToken(req, res, next));
router.use((req, res, next) => getRole(req, res, next));
router.get('/', itemController.listAll);
router.get('/shopkeepers', itemController.listShopkeepersItems);
router.post('/', itemController.add);
router.get('/:id', itemController.getOne);
router.put('/:id');
router.delete('/:id');
router.put('/:id/sell/:userid');

module.exports = router;
