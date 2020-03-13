const express = require('express');
const multer = require('multer');
const itemController = require('../controllers/itemController');
const verifyToken = require('../authentication/verifyToken');
const getRole = require('../authentication/getRole');

const router = express.Router();
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'client/public/itemimages/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const allowedTypes = ['image/jpeg', 'image/png'];
const upload = multer({
  storage,
  fileFilter: function(req, file, cb) {
    if (allowedTypes.indexOf(file.mimetype) < 0) {
      return cb(null, false);
    }
    cb(null, true);
  },
  limits: { fileSize: 2 * 1000000 },
}).single('image');

router.get('/shopkeepers', itemController.listShopkeepersItems);
router.use((req, res, next) => verifyToken(req, res, next));
router.use((req, res, next) => getRole(req, res, next));
router.get('/', itemController.listAll);
router.get('/customers', itemController.listCustomersItems);
router.post('/', upload, itemController.add);
router.get('/:id', itemController.getOne);
router.put('/:id', itemController.updateOne);
router.delete('/:id', itemController.deleteOne);
router.put('/:id/sell/:userid', itemController.sellOne);

module.exports = router;
