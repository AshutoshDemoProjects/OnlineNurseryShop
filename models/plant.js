var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: {
        type: String,
        required: 'this field is required'
    },
    price: {
        type: Number,
        required: 'this field is required'
    },
    size: {
        type: String,
        required: 'this field is required'
    },
    shortDescription: {
        type: String
    },
    fullDescription: {
        type: String
    },
    difficulty: {
        type: String
    },
    light: {
        type: String
    },
    petfriendly: {
        type: Boolean
    },
    airCleaner: {
        type: Boolean
    },
    botanicalName: {
        type: String
    },
    imagePath: {
        type: String
    }
});
module.exports = mongoose.model('Plant', schema);