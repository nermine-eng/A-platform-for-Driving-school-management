const router = require('express').Router()
const verify = require('./verifyToken')

router.get('/',verify,(req,res)=>{
    const user = req.user
    res.json(user)
})
module.exports = router