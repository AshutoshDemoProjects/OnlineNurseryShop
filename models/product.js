var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    imagePath: {type: String},
    title : {type: String, required :'this field is required'},
    price : {type: Number, required :'this field is required'}
});

module.exports = mongoose.model('Product',schema);