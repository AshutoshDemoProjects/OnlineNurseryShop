const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/shopping", { useNewUrlParser: true },(err)=>{
    if(!err){ console.log("MongoDB connection succeeded..."); }
    else{ console.error('Error in database connection :- '+err); }
});

require('./plant');
require('./product');
require('./order');
require('./user');