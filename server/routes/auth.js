const router = require('express').Router()
const User = require('../modals/user_modal')
const Joi = require('@hapi/joi')
const bcrypt= require('bcryptjs')
const jwt = require('jsonwebtoken') // same as a cookie that remember that you are signed in

router.post('/register', async (req, res) => {
    if (!register_validation(req.body, res))return
    //hashing
    const salt = await bcrypt.genSalt(10) //10 is the complexity
    const hashedPassword=await bcrypt.hash(req.body.password,salt)
    const result = await User.find().sort({ id: -1 }).limit(1)
    const user = new User({
        id: (result.length>0 )?result[0].id+1: 1,
        name: req.body.name,
        password: hashedPassword,
        CIN:req.body.CIN,
        telephone:req.body.telephone,
        role: (req.body.role)?req.body.role:'User',
        e_mail: req.body.e_mail,
        payment: false,
        finished: false,
        sessions: [],
        reclamations:[],
        code_exam:false,
        conduite_exam:false,
    })
    try {
        user.save()
            .then((result) => res.json(result))
            .catch((err) => res.status(400).send(err.message))
    } catch (err) {
        res.status(400).send(err)
    }

})
router.post('/login',async (req,res)=>{
    //validation of pass and e-mail
    if (!login_validation(req.body,res)){return}
    // check if email exists
    const user=await User.findOne({e_mail:req.body.e_mail})
    if (!user) return res.status(400).send('Email doesnt exists')
    //password verification
    const password_verification =await bcrypt.compare(req.body.password,user.password)
    if(!password_verification) return res.status(400).send('Password is incorrect')
    const token = jwt.sign({userData:user},process.env.TOKEN_SECRET)
    res.header('auth-token',token)//we added the token here
    res.json({id:user.id,role:user.role,token:token})


})



module.exports = router


function register_validation(data, res) {
    const schema = Joi.object({
        name: Joi.string().min(4).required(),
        password: Joi.string().min(6).required(),
        e_mail: Joi.string().min(6).required().email(), 
        role:Joi.string(),
        CIN:Joi.number().required(),
        telephone:Joi.number().required()
    })
    const { error } = schema.validate(data)
    if (error) {
        res.status(400).send(error.details[0].message)
    }
    return (!error)
}


function login_validation(data, res) {
    const schema = Joi.object({
        e_mail: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),

    })
    const { error } = schema.validate(data)
    if (error) {
        res.status(400).send(error.details[0].message)
    }
    return (!error)
}