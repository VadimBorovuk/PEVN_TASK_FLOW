const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController');
const accessMiddleware = require('../middlewares/auth')

const {body} = require('express-validator')

// AUTH API
router.get('/refresh', userController.refresh)
router.post('/registration',
    body('name').isLength({min: 2, max: 50}).notEmpty(),
    body('email').isEmail().notEmpty(),
    body('password').isLength({min: 6, max: 32}).notEmpty(),
    userController.registration)

router.post('/login',
    body('email').isEmail().notEmpty(),
    body('password').isLength({min: 6, max: 32}).notEmpty(),
    userController.login)
router.post('/logout', userController.logout)

// CRUD USERS
router.put('/update', userController.update)
router.delete('/delete', userController.delete)
router.get('/', accessMiddleware, userController.getAll)
router.get('/activate/:link', userController.activeLink)
module.exports = router;
