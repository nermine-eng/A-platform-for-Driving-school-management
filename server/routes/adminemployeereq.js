const router = require('express').Router()
const verify = require('./verifyToken')
const Employee = require('../modals/employee_modal')
const Joi = require('@hapi/joi')

// get all 

router.get('/employees', verify, (req, res) => {
    const role = req.user.userData.role
    if (role !== "Admin") return res.status(401).send('bad request')
    Employee.find().then(result => res.send(result))
        .catch(err => console.log(err))
})

//get one 
router.get('/:id', verify, async (req, res) => {
    const role = req.user.userData.role
    if (role !== "Admin") return res.status(401).send('bad request')
    const employee = await Employee.findOne({id: req.params.id })
    if (!employee) res.status(404).send('employee not found')
    res.send(employee)
})

//post one

function employee_validation(data, res) {
    const schema = Joi.object({
        name: Joi.string().min(4).required(),
        salaire: Joi.number().required(),
        dayofpayment: Joi.number().required()
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
    if (!employee_validation(req.body, res)) { return }
    const employee = await Employee.findOne().sort({ id: -1 })
    const emp = new Employee({
        id: (employee) ? employee.id + 1 : 1,
        name: req.body.name,
        sessions: [],
        salaire: req.body.salaire,
        payment: false,
        dayofpayment: req.body.dayofpayment,
    })
    emp.save()
        .then(result => res.send(result))
        .catch(err => res.status(400).send(err.message))
})

//put one
function employee_update_validation(data, res) {
    const schema = Joi.object({
        name: Joi.string().min(4).required(),
        salaire: Joi.number().required(),
        payment:Joi.boolean().required(),
        dayofpayment: Joi.number()
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
    if (!employee_update_validation(req.body, res)) { return }
    const employee = await Employee.findOne({ id: req.params.id })
    if (!employee) return res.status(400).send('employee doesnt exist')
    const emp = await Employee.updateOne(
        { id: req.params.id },
        {
            $set: {
                name: req.body.name,
                salaire: req.body.salaire,
                payment: req.body.payment,
            }
        }
    )
    res.send('updated')

})

//delete One 

router.delete('/:id', verify, async (req, res) => {
    const role = req.user.userData.role
    if (role !== "Admin") return res.status(401).send('bad request')
    const employee = await Employee.findOne({ id: req.params.id })
    if (!employee) return res.status(404).send('employee not found!')
    Employee.deleteOne({ id: req.params.id }).then(() => res.send(employee))
})

module.exports = router