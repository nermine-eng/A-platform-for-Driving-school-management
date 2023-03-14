const mongoose=require('mongoose')
const schema = mongoose.Schema

const employeeSchema = new schema({
    id:{
        unique:true,
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:[true,'Verifiez le nom svp !'],
        minlength: 4
    },
    sessions:{
        type:Array,
        required:true,
    },
    salaire:{
        type:Number,
        min:0,
        required:true,
    },
    payment:{
        type:Boolean,
        required:true,
    },
    dayofpayment:{
        type:Number,
        min:1,
        max:30,
        required:true
    }

},{timestamps:true})
const Employee = mongoose.model('Employee',employeeSchema)
module.exports=Employee