const router = require('express').Router()
const verify = require('./verifyToken')
const Session =require('../modals/session_modal')
const User = require('../modals/user_modal')
const bcrypt= require('bcryptjs')
const Joi = require('@hapi/joi')

router.get('/sessions/:id',verify,async (req,res)=>{
    const id=req.user.userData.id
    const role=req.user.userData.role
    if (role!=='User' || id!== parseInt(req.params.id)) return res.status(400).send('Not authorized!')
    sessions = await Session.find({clientId:id})
    const user_sessions = sessions.filter(s=>s.clientId===id)
    return res.send(user_sessions)
})


function update_validation(data, res) {
    const schema = Joi.object({
        name: Joi.string().min(4).required(),
        password: Joi.string().min(6),
        e_mail: Joi.string().min(6).required().email(), 
        CIN:Joi.number().required(),
        telephone:Joi.number().required()
    })
    const { error } = schema.validate(data)
    if (error) {
        res.status(400).send(error.details[0].message)
    }
    return (!error)
}

router.put('/update/:id',verify,async(req,res)=>{
    const id=req.user.userData.id
    const role=req.user.userData.role
    if (role!=='User' || id!== parseInt(req.params.id)) return res.status(400).send('Not authorized!')
    if(!update_validation(req.body,res))return    
    const action = await User.updateOne({id:id},{
        $set:{
            name:req.body.name,
            e_mail:req.body.e_mail,
            CIN:req.body.CIN,
            telephone:req.body.telephone
        }
    })
    if(req.body.password){
        let salt = await bcrypt.genSalt(10) //10 is the complexity
        let hashedPassword=await bcrypt.hash(req.body.password,salt)
       await User.updateOne({id:id},{
           $set:{password:hashedPassword}
       })
    }
    res.send('updated the user !')

})
router.put('/paiement/:id',verify,async(req,res)=>{
    const id=req.user.userData.id
    const role=req.user.userData.role
    if (role!=='User' || id!== parseInt(req.params.id)) return res.status(400).send('Not authorized!')
    const schema = Joi.object({payment:Joi.boolean().required()})
    const { error } = schema.validate(req.body)
    if (error) {
        res.status(400).send(error.details[0].message)
    }
    const action = await User.updateOne({id:id},{
        $set:{
            payment:req.body.payment
        }
    })
    res.send('updated !')

})


module.exports = router