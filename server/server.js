const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const dotenv=require('dotenv')

dotenv.config()

//routes import
const authRoute = require('./routes/auth')
const authInfoRoute = require('./routes/authinfo')
const AdminClientRoute = require('./routes/adminclientreq')
const AdminSessionRoute = require('./routes/adminsessionreq')
const AdminEmployeeRoute = require('./routes/adminemployeereq')
const AdminVehRoute=require('./routes/adminvehreq')
const ClientRoute = require('./routes/clientreq')

//app use
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//CORS

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT") // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "*");
    next();
});


//mongodb connection'
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true ,'useCreateIndex': true})
    .then(() => console.log('connected to database'))
    .catch((error) => console.log(error))



//app routes
app.get('/', (req, res) => {
    res.send('HELLOOOOOO AUTO ECOLE')
})

app.use('/api/user', authRoute)
app.use('/api/auth',authInfoRoute)
app.use('/api/admin',AdminClientRoute)
app.use('/api/admin/session',AdminSessionRoute)
app.use('/api/admin/employee',AdminEmployeeRoute)
app.use('/api/admin/vehicule',AdminVehRoute)
app.use('/api/client',ClientRoute)

port = process.env.PORT || 3001
app.listen(port, () => console.log(`listening on port ${port}`))