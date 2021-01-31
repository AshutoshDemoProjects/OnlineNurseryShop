var Product = require('../models/product');
var mongoose = require('mongoose');
//mongoose.connect('localhost:27017/shopping');
mongoose.connect("mongodb://localhost:27017/shopping", { useNewUrlParser: true });
var products =[ new Product({
    imagePath : 'https://bloomscape.com/wp-content/uploads/2018/09/Bloomscape_red-prayer-plant_A.jpg',
    title : 'Red prayer plant: Colour and red with two toned leaves',
    price : 20
}),
new Product({
    imagePath : 'https://bloomscape.com/wp-content/uploads/2018/02/Bloomscape_HedgeHogAloe_A-416x504.jpg',
    title : 'Hedgehoge Aloe',
    price : 30
}),
new Product({
    imagePath : 'https://bloomscape.com/wp-content/uploads/2018/11/Bloomscape_plantspeople_Pepperomia.jpg',
    title : 'Pepperomia',
    price : 20
}),
new Product({
    imagePath : 'https://bloomscape.com/wp-content/uploads/2018/12/Bloomscape_NeonPothos-A.jpg',
    title : 'Neon pothos',
    price : 50
}),
new Product({
    imagePath : 'https://bloomscape.com/wp-content/uploads/2018/11/Bloomscape_Pink-Dalmatian-Aglaonema_A-768x931.jpg',
    title : 'Pink Dalmatian Aglaonema',
    price : 34
}),
new Product({
    imagePath : 'https://bloomscape.com/wp-content/uploads/2018/06/Bloomscape_Product_Plants_Philodendron-Brasil.jpg',
    title : 'Plants Philodendron Brasil',
    price : 30
}),
new Product({
    imagePath : 'https://bloomscape.com/wp-content/uploads/2018/02/Bloomscape_BurgundyRubberTree_A-768x931.jpg',
    title : 'Bloomscape Burgundry Rubbertree',
    price : 20
}),
new Product({
    imagePath : 'https://bloomscape.com/wp-content/uploads/2018/11/Bloomscape_Dracaena-Colorama_A-416x504.jpg',
    title : ' Dracaena Colorama',
    price : 15
}),
new Product({
    imagePath : 'https://bloomscape.com/wp-content/uploads/2018/02/Bloomscape_FiddleLeafFig_A-416x504.jpg',
    title : 'fiddle leaf fig ',
    price : 25
}),

];

var done = 0;
for(var i = 0; i < products.length; i++){
    products[i].save(function(err,result){
        done++;
        if(done == products.length){
            exit();
        }
    });
}
function exit(){
mongoose.disconnect();
}

 