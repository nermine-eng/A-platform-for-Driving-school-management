const router = require('express').Router()
const verify = require('./verifyToken')
const Vehicule =require('../modals/car_modal')
const Joi = require('@hapi/joi')

router.get('/vehicules', verify, (req, res) => {
    const role = req.user.userData.role
    if (role !== "Admin") return res.status(401).send('bad request')
    Vehicule.find().then(result => res.send(result))
        .catch(err => console.log(err))
})

router.get('/:id', verify, async (req, res) => {
    const role = req.user.userData.role
    if (role !== "Admin") return res.status(401).send('bad request')
    const car = await Vehicule.findOne({id: req.params.id })
    if (!car) res.status(404).send('car not found')
    res.send(car)
})

//post one

function car_validation(data, res) {
    const schema = Joi.object({
        marque: Joi.string().min(2).required(),
        modele: Joi.string().min(1).required(),
        serie:Joi.string().required(),
        etat:Joi.number().required(),
        dateAchat:Joi.date().required(),
        visiteTech:Joi.date().required(),
        periodeP:Joi.number().max(24).min(1).required(),
        periodeG:Joi.number().max(48).min(6).required(),
        jourP:Joi.number().max(31).min(1).required(),
        jourG:Joi.number().max(31).min(1).required(),
        disponibilite:Joi.required(),
        vignettes:Joi.boolean().required(),
        assurances:Joi.boolean().required(),
        imageLink:Joi.string()
    })
    const { error } = schema.validate(data)
    if (error) {
        res.status(400).send(error.details[0].message)
    }
    return (!error)
}

router.post('/add', verify, async (req, res) => {
    const role = req.user.userData.role
    if (role !== "Admin") return res.status(401).send('bad request')
    if (!car_validation(req.body, res)) { return }
    const car= await Vehicule.findOne().sort({ id: -1 })
    const vehicule = new Vehicule({
        id: (car) ? car.id + 1 : 1,
        marque: req.body.marque,
        modele: req.body.modele,
        serie:req.body.serie,
        etat:req.body.etat,
        dateAchat:req.body.dateAchat,
        visiteTech:req.body.visiteTech,
        entretienP:{
            periode:req.body.periodeP,
            jour:req.body.jourP
        },
        entretienG:{
            periode:req.body.periodeG,
            jour:req.body.jourG
        },
        disponibilite:req.body.disponibilite,
        papiers:{
            vignettes:req.body.vignettes,
            assurances:req.body.assurances
        },
        service:req.body.disponibilite,
    })
    if(req.body.imageLink) vehicule.imageLink =req.body.imageLink
   vehicule.save()
        .then(result => res.send(result))
        .catch(err => res.status(400).send(err.message))
})
//put one
function car_update_validation(data, res) {
    const schema = Joi.object({
        marque: Joi.string().required(),
        modele: Joi.string().required(),
        etat:Joi.number().required(),
        periodeP:Joi.number().max(24).min(1).required(),
        periodeG:Joi.number().max(48).min(6).required(),
        jourP:Joi.number().max(31).min(1).required(),
        jourG:Joi.number().max(31).min(1).required(),
        vignettes:Joi.boolean().required(),
        assurances:Joi.boolean().required(),
        disponibilite:Joi.required(),
        visiteTech:Joi.date().required(),
    })
    const { error } = schema.validate(data)
    if (error) {
        res.status(400).send(error.details[0].message)
    }
    return (!error)
}

router.put('/:id', verify, async (req, res) => {
    const role = req.user.userData.role
    if (role !== "Admin") return res.status(401).send('bad request')
    if (!car_update_validation(req.body, res)) { return }
    const car = await Vehicule.findOne({ id: req.params.id })
    if (!car) return res.status(400).send('car doesnt exist')
    const validation = await Vehicule.updateOne(
        { id: req.params.id },
        {
            $set: {
                marque: req.body.marque,
                modele: req.body.modele,
                etat:   req.body.etat,
                entretienP:{
                    periode:req.body.periodeP,
                    jour:req.body.jourP
                },
                entretienG:{
                    periode:req.body.periodeG,
                    jour:req.body.jourG
                },
                papiers:{
                    vignettes:req.body.vignettes,
                    assurances:req.body.assurances
                },
                visiteTech:req.body.visiteTech,
                disponibilite: req.body.disponibilite,
                
            }
        }
    )
    res.send('updated')

})


router.delete('/:id', verify, async (req, res) => {
    const role = req.user.userData.role
    if (role !== "Admin") return res.status(401).send('bad request')
    const car = await Vehicule.findOne({ id: req.params.id })
    if (!car) return res.status(404).send('car not found!')
    Vehicule.deleteOne({ id: req.params.id }).then(() => res.send(car))
})


module.exports=router