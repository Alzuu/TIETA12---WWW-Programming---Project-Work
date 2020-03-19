const express = require('express');
const multer = require('multer');
const itemController = require('../controllers/itemController');
const verifyToken = require('../authentication/verifyToken');
const getRole = require('../authentication/getRole');

const router = express.Router();

// Set up multer for uploading images
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'client/public/itemimages/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
// Set up limits for files: only jpeg/png images and max 5MB in size
const allowedTypes = ['image/jpeg', 'image/png'];
const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    if (allowedTypes.indexOf(file.mimetype) < 0) {
      return cb(null, false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1000000 },
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
