const Router = require('express')
const router = new Router()
const commentController = require('../controllers/commentController')

router.get('/', commentController.getAll)
router.get('/:id', commentController.getOne)
router.post('/create', commentController.create)
router.put('/update', commentController.update)
router.delete('/delete', commentController.delete)

module.exports = router;
