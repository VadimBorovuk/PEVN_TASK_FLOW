const Router = require('express')
const router = new Router()
const profileController = require('../controllers/profileController')
const {uploadSingle} = require('../middlewares/multer')

router.get('/', profileController.getAll)
router.get('/owner_info', profileController.getInfoOwner)
router.get('/:id', profileController.getOne)
router.post('/create', uploadSingle('avatar_url'), profileController.create)
router.put('/update', profileController.update)
router.delete('/delete', profileController.delete)

module.exports = router;

