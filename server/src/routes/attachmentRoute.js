const Router = require('express')
const router = new Router()
const {uploadMultiple} = require('../middlewares/multer')
const attachmentController = require('../controllers/attachmentController')

router.get('/', attachmentController.getAll)
router.get('/:id', attachmentController.getOne)
router.post('/create', uploadMultiple('attachments'), attachmentController.create)
router.delete('/delete', attachmentController.delete)

module.exports = router;
