
const express = require('express')
const router = express.Router()
const controller = require('../controllers/usersControllers')

router.get("/",controller.getUsers)
router.delete("/",controller.delete)
router.post("/create",controller.post)
router.put('/lastlogin',controller.updateLastLogin)
router.put('/',controller.updateUser)


module.exports = router