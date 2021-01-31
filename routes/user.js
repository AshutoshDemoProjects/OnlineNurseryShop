var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var User = require('../models/user');

var Order = require('../models/order');
var Cart = require('../models/cart');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, function (req, res, next) {
    Order.find({
        user: req.user
    }, function (err, orders) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        orders.forEach(function (order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.render('user/profile', {
            orders: orders
        });
    });
});
router.get('/sort', isLoggedIn, function (req, res, next) {
    console.log("called");
    Order.find({
        "orderedAt": {
            "$gte": new Date("2019-02-26T06:15:02.110Z"),
            "$lt": new Date("2019-02-28T06:15:02.110Z")
        }
    }, function (err, orders) {
        console.log(orders);
        if (err) {
            return res.write('Error!');
        }
        orders.forEach(function (order) {
            console.log(order);
            //cart = new Cart(order.cart);
            //order.items = cart.generateArray();
        });
        res.render('user/sort', {
            orders: orders
        });
    });
});

router.get('/logout', isLoggedIn, function (req, res, next) {
    req.session.isAdmin = false;
    req.logout();
    res.redirect('/');
});

router.use('/', notLoggedIn, function (req, res, next) {
    next();
});

router.get('/signup', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', {
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
});

router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});

router.get('/signin', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signin', {
        csrfToken: req.csrfToken(),
        messages: messages,
        hasErrors: messages.length > 0
    });
});

router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        User.findOne({
            'email': req.body.email
        }, (err, user) => {
            if (user.isAdmin) {
                req.session.isAdmin = true;
                res.redirect('/admin/');
            } else {
                req.session.isAdmin = false;
                res.redirect('/user/profile');
            }
        });
    }
});

module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}