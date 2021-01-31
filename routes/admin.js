const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
var orderHelper = require('../models/orderHelper');

var router = express.Router();

var Plant = mongoose.model('Plant');
var User = mongoose.model('User');
var Order = mongoose.model('Order');




function isLoggedIn(req, res, next) {
    if (req.isAuthenticated() && req.session.isAdmin) {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}
router.use(isLoggedIn);

const multerConfig = {
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, './public/uploads')
        },
        filename: function (req, file, cb) {
            const ext = file.mimetype.split('/')[1];
            cb(null, file.fieldname + '-' + Date.now() + '.' + ext)
        }
    }),
    fileFilter: (req, file, next) => {
        if (!file) {
            next();
        }
        const image = file.mimetype.startsWith('image/');
        if (image) {
            next(null, true);
        } else {
            next({
                message: "File type not supported"
            });
        }
    }

};

router.get('/', orderHelper.getCounts, orderHelper.getMonthCounts, (req, res, next) => {
    var currentDate = new Date(Date.now());
    var year = currentDate.getFullYear();
    var counts = req.body.counts;
    var monthCount = req.body.monthCount;
    plantCount = counts[0].plantCount;
    userCount = counts[1].userCount;
    orderCount = counts[2].orderCount;
    monthOrderCount = counts[3].orderCount;
    res.render("admin/home", {
        title: "Admin Dashboard",
        plantCount,
        userCount,
        orderCount,
        monthOrderCount,
        monthCount,
        tableTitle: `Sales: 1 Jan, ${year} - 31 December, ${year}`

    });
});

router.get('/plant/add', (req, res, next) => {
    res.render("admin/plantAddOrEdit", {
        viewTitle: "Insert Plant",
        title: "Insert Plant"
    });
});
router.post('/plant/add', multer(multerConfig).single('plant'), (req, res) => {
    if (req.body._id == '') {
        insertRecord(req, res);
    } else {
        updateRecord(req, res);
    }
});
router.get('/plant/show/:id', (req, res, next) => {
    Plant.findById(req.params.id, (err, _plant) => {
        if (!err) {
            res.render("admin/plantShow", {
                title: "Plant Details",
                plant: _plant
            });
        }
    });
});
router.get('/plant/list', (req, res) => {
    Plant.find((err, doc) => {
        if (!err) {
            res.render('admin/plantsList', {
                list: doc,
                title: "Plant List"
            });
        } else {
            console.log("list error:-" + err);
        }
    });
    Plant.find((err, doc) => {
        if (!err) {

        } else {
            console.log(doc);
        }
    });
});
router.post('/plant/search', (req, res) => {
    Plant.find({
        name: {
            '$regex': req.body.plantName,
            '$options': 'i'
        }
    }, (err, plants) => {
        console.log("search" + plants);
        if (!err) {
            res.render('admin/plantsList', {
                list: plants,
                title: "Plant List"
            });
        } else {
            console.log("list error:-" + err);
        }
    });
});
router.get('/plant/details/:id', (req, res, next) => {
    Plant.findById(req.params.id, (err, _plant) => {
        if (!err) {
            res.render("admin/plantAddOrEdit", {
                viewTitle: "Edit Plant",
                title: "Edit Plant",
                plant: _plant
            });
        }
    });
});
router.get('/plant/delete/:id', (req, res) => {
    fileName = "";
    Plant.findById(req.params.id, (err, plant) => {
        fileName = plant.imagePath;
        fileName = path.resolve('public/uploads/' + fileName);
        try {
            fs.unlinkSync(fileName);
        } catch (err) {
            console.error("Error:- " + err);
        }
    });

    Plant.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/admin/plant/list');
        } else {
            console.log("remove error:-" + err);
        }
    });
});
router.get('/plant/:id', (req, res, next) => {
    Plant.findById(req.params.id, (err, _plant) => {
        if (!err) {
            res.render("admin/plantAddOrEdit", {
                viewTitle: "Edit Plant",
                title: "Edit Plant",
                plant: _plant
            });
        }
    });
});

function insertRecord(req, res) {

    var plant = new Plant();
    plant.name = req.body.name;
    plant.price = req.body.price;
    plant.size = req.body.size;
    plant.shortDescription = req.body.shortDescription;
    plant.fullDescription = req.body.fullDescription;
    plant.difficulty = req.body.difficulty;
    plant.light = req.body.light;
    plant.petfriendly = req.body.petfriendly;
    plant.airCleaner = req.body.airCleaner;
    plant.botanicalName = req.body.botanicalName;
    plant.imagePath = req.file.filename;

    plant.save((err, plant) => {
        if (!err) {
            res.redirect('/admin/plant/list');
        } else {
            console.log(err);
            if (err.name == 'ValidationError') {
                handalValidationError(err, req.body);
                res.render("admin/addOrEdit", {
                    viewTitle: "Insert plant",
                    title: "Insert plant",
                    plant: req.body
                });
            }

        }
    });
}

function updateRecord(req, res) {
    Plant.findOneAndUpdate({
        _id: req.body._id
    }, req.body, {
        new: true
    }, (err, doc) => {
        if (!err) {
            res.redirect('/admin/plant/list');
        } else {
            if (err.name == 'ValidationError') {
                handalValidationError(err, req.body);
                res.render("admin/plantAddOrEdit", {
                    viewTitle: "Edit plants",
                    title: "Edit plants",
                    plant: req.body
                });
            }
        }
    });
}

function handalValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'name':
                body['nameError'] = err.errors[field].message;
                break;
            case 'price':
                body['priceError'] = err.errors[field].message;
                break;
            case 'size':
                body['sizeError'] = err.errors[field].message;
                break;
            case 'shortDescription':
                body['priceError'] = err.errors[field].message;
                break;
            case 'fullDescription':
                body['NameError'] = err.errors[field].message;
                break;
            case 'petfriendly':
                body['petfriendlyError'] = err.errors[field].message;
                break;
            case 'airCleaner':
                body['airCleanerError'] = err.errors[field].message;
                break;
            case 'botanicalName':
                body['priceError'] = err.errors[field].message;
                break;
        }
    }
}
module.exports = router;