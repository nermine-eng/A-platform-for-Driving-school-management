const mongoose=require('mongoose')
const schema = mongoose.Schema

const sessionSchema = new schema({
    ref:{
        unique:true,
        type:String,
        required:true,
    },
    clientId:{
        type:Number,
        required:true,
    },
    employeeId:{
        type:Number,
    },
    vehiculeId:{
        type:Number,
    },
    date:{
        type:Date,
        required:true
    }

},{timestamps:true})
const Session = mongoose.model('Session',sessionSchema)
module.exports=Session