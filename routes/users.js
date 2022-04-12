
const express = require('express')
const router = express.Router()
const controller = require('../controllers/usersControllers')

router.get("/",controller.get)
router.delete("/",controller.delete)
router.post("/create",controller.post)
router.put('/lastlogin',controller.put)


module.exports = router