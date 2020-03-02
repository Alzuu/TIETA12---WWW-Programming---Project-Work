const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/test', function(req, res, next) {
    res.send('users test 4 8 15 16 23 42');
});

router.get('/', (req, res, next) => {
    next();
}, userController.list);

router.post('/', (req, res, next) => {
    next();
}, userController.create);

router.get('/:id', (req, res, next) => {
    next();
}, userController.one);

router.put('/:id', (req, res, next) => {
    next();
}, userController.modify);

router.delete('/', (req, res, next) => {
    next();
}, userController.delete);

router.delete('/:id', (req, res, next) => {
    next();
}, userController.deleteOne);

router.post('/login', (req, res, next) => {
    next();
}, userController.login);

router.post('/logout', (req, res, next) => {
    next();
}, userController.logout);

/*
router.get('/:id/items');
*/

module.exports = router;
