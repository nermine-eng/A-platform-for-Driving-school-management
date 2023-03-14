const mongoose=require('mongoose')
const schema = mongoose.Schema
const validator = require('validator')

const userSchema = new schema({
    id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:[true,'Verifiez le nom svp !'],
        minlength: 4
    },
    password:{
        type:String,
        required:[true,'Verifiez le mot de passe svp !'],
        minlength:8
    },
    role:{
        type:String,
        enum:['Admin','User'],
        required:[true,'Verifiez le nom svp !'],
        default:'User'
    },
    e_mail:{
        type:String,
        unique:true,
        required:[true,'Verifiez l email svp!'],
        lowercase:true,
        validate:[validator.isEmail,'Entrer un e_mail valide']
    },
    CIN:{
        type:Number,
        unique:true,
        required:true
    },
    telephone:{
        type:Number,
        unique:true,
        required:true
    },
    payment:{
        type:Boolean,
        required:true,
    },
    finished:{
        type:Boolean,
        required:true,
    },
    sessions:{
        type:Array,
        required:true,
    },
    code_exam:{
        type:Boolean,
        required:true
    },
    conduite_exam:{
        type:Boolean,
        required:true
    },
    reclamations:{
        type:Array
    },
    photo:String,

},{timestamps:true})
const User = mongoose.model('User',userSchema)
module.exports=User