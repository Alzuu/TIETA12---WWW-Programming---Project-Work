const express = require('express');
const getRole = require('../authentication/getRole');
const verifyToken = require('../authentication/verifyToken');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/', userController.create);
router.use((req, res, next) => verifyToken(req, res, next));
router.use((req, res, next) => getRole(req, res, next));
router.get('/', userController.list);
router.get('/:id', userController.one);
router.put('/:id', userController.modify);
router.delete('/', userController.delete);
router.delete('/:id', userController.deleteOne);
router.get('/:id/items', verifyToken, userController.listItems);

module.exports = router;
