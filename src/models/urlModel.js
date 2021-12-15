const mongoose = require('mongoose')

// instantiate a mongoose schema
const URLSchema = new mongoose.Schema({
    urlCode: {
        type:String,
        required:[true, "urlCode is required"],
        unique : true,
        lowercase: true,
        trim : true
    },
    longUrl:{
        type:String,
        required:[true, "longUrl is required"],
        unique : true,
        trim : true
    },
    shortUrl:{
        type:String,
        requied:[true,"shorten url is required"],
        unique : true
    },
}, { timestamps: true })

// create a model from schema and export it
module.exports = mongoose.model('Url', URLSchema)
