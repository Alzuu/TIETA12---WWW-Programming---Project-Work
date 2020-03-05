const express = require('express');
const itemController = require('../controllers/itemController');
const verifyToken = require('../authentication/verifyToken');
const getRole = require('../authentication/getRole');

const router = express.Router();

router.get('/shopkeepers', itemController.listShopkeepersItems);
router.use((req, res, next) => verifyToken(req, res, next));
router.use((req, res, next) => getRole(req, res, next));
router.get('/', itemController.listAll);
router.get('/customers', itemController.listCustomersItems);
router.post('/', itemController.add);
router.get('/:id', itemController.getOne);
router.put('/:id', itemController.updateOne);
router.delete('/:id', itemController.deleteOne);
router.put('/:id/sell/:userid', itemController.sellOne);

module.exports = router;
