const mongoose=require('mongoose')
const schema = mongoose.Schema

const vehiculeSchema = new schema({
    id:{
        unique:true,
        type:Number,
        required:true,
    },
    marque:{
        type:String,
        required:true,
    },
    modele:{
        type:String,
        required:true,
    },
    serie:{
        unique:true,
        type:String,
        required:true,
    },
    etat:{
        type:Number,
        required:true,
        min:1,
        max:5
    },
    dateAchat:{
        type:Date,
        required:true,
    },
    entretienP:{
        type:Object,
        required:true,
    },
    entretienG:{
        type:Object,
        required:true,
    },
    visiteTech:{
        type:Date,
        required:true
    },
    papiers:{
        type:Object,
        required:true
    },
    disponibilite:{
        type:Boolean,
        required:true
    },
    service:{
        type:Boolean,
        required:true
    },
    imageLink:{
        type:String,
    },
    service:{
        type:Boolean,
    }

},{timestamps:true})
const Vehicule = mongoose.model('Vehicule',vehiculeSchema)
module.exports=Vehicule