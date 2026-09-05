const Router = require('express')
const router = new Router()
const projectController = require('../controllers/projectController')

router.get('/', projectController.getAll)
router.get('/:id', projectController.getOne)
router.post('/create', projectController.create)
router.put('/update', projectController.update)
router.delete('/delete', projectController.delete)

module.exports = router;


/*
* 1.tasks
* 2. comments
* 3. attachments
* */
