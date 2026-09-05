const Router = require('express')
const router = new Router()
const userRoute = require('./userRoute')
const projectRoute = require('./projectRoute')
const profileRoute = require('./profileRoute')
const tasksRoute = require('./tasksRoute')
const commentRoute = require('./commentRoute')
const attachmentRoute = require('./attachmentRoute')

router.use('/user', userRoute)
router.use('/project', projectRoute)
router.use('/profile', profileRoute)
router.use('/task', tasksRoute)
router.use('/comment', commentRoute)
router.use('/attachment', attachmentRoute)

module.exports = router;
