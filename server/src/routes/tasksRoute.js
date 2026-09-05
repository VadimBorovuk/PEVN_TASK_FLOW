const Router = require('express')
const router = new Router()
const tasksController = require('../controllers/taskController')

router.get('/', tasksController.getAll)
router.get('/:id', tasksController.getOne)
router.post('/create', tasksController.create)
router.put('/update', tasksController.update)
router.delete('/delete', tasksController.delete)

module.exports = router;
