const mongoose = require('mongoose');
var Plant = mongoose.model('Plant');
var User = mongoose.model('User');
var Order = mongoose.model('Order');


getMonthCounts = (req, res, next) => {
    var monthCount = [];
    currentDate = new Date(Date.now());
    year = currentDate.getFullYear();
    Order.countDocuments({
        "orderedAt": {
            "$gte": new Date(year, 0, 1, 0, 0, 0, 0),
            "$lt": new Date(year, 0, 31, 23, 59, 59, 59)
        }
    }, (err, count) => {

        if (!err) {
            monthCount.push(count);
            Order.countDocuments({
                "orderedAt": {
                    "$gte": new Date(year, 1, 1, 0, 0, 0, 0),
                    "$lt": new Date(year, 1, 28, 23, 59, 59, 59)
                }
            }, (err, count) => {
                if (!err) {
                    monthCount.push(count);
                    Order.countDocuments({
                        "orderedAt": {
                            "$gte": new Date(year, 2, 1, 0, 0, 0, 0),
                            "$lt": new Date(year, 2, 31, 23, 59, 59, 59)
                        }
                    }, (err, count) => {
                        if (!err) {
                            monthCount.push(count);
                            Order.countDocuments({
                                "orderedAt": {
                                    "$gte": new Date(year, 3, 1, 0, 0, 0, 0),
                                    "$lt": new Date(year, 3, 30, 23, 59, 59, 59)
                                }
                            }, (err, count) => {
                                if (!err) {
                                    monthCount.push(count);
                                    Order.countDocuments({
                                        "orderedAt": {
                                            "$gte": new Date(year, 4, 1, 0, 0, 0, 0),
                                            "$lt": new Date(year, 4, 31, 23, 59, 59, 59)
                                        }
                                    }, (err, count) => {
                                        if (!err) {
                                            monthCount.push(count);
                                            Order.countDocuments({
                                                "orderedAt": {
                                                    "$gte": new Date(year, 5, 1, 0, 0, 0, 0),
                                                    "$lt": new Date(year, 5, 30, 23, 59, 59, 59)
                                                }
                                            }, (err, count) => {
                                                if (!err) {
                                                    monthCount.push(count);
                                                    Order.countDocuments({
                                                        "orderedAt": {
                                                            "$gte": new Date(year, 6, 1, 0, 0, 0, 0),
                                                            "$lt": new Date(year, 6, 31, 23, 59, 59, 59)
                                                        }
                                                    }, (err, count) => {
                                                        if (!err) {
                                                            monthCount.push(count);
                                                            Order.countDocuments({
                                                                "orderedAt": {
                                                                    "$gte": new Date(year, 7, 1, 0, 0, 0, 0),
                                                                    "$lt": new Date(year, 7, 31, 23, 59, 59, 59)
                                                                }
                                                            }, (err, count) => {
                                                                if (!err) {
                                                                    monthCount.push(count);
                                                                    Order.countDocuments({
                                                                        "orderedAt": {
                                                                            "$gte": new Date(year, 8, 1, 0, 0, 0, 0),
                                                                            "$lt": new Date(year, 8, 31, 23, 59, 59, 59)
                                                                        }
                                                                    }, (err, count) => {
                                                                        if (!err) {
                                                                            monthCount.push(count);
                                                                            Order.countDocuments({
                                                                                "orderedAt": {
                                                                                    "$gte": new Date(year, 9, 1, 0, 0, 0, 0),
                                                                                    "$lt": new Date(year, 9, 31, 23, 59, 59, 59)
                                                                                }
                                                                            }, (err, count) => {
                                                                                if (!err) {
                                                                                    monthCount.push(count);
                                                                                    Order.countDocuments({
                                                                                        "orderedAt": {
                                                                                            "$gte": new Date(year, 10, 1, 0, 0, 0, 0),
                                                                                            "$lt": new Date(year, 10, 31, 23, 59, 59, 59)
                                                                                        }
                                                                                    }, (err, count) => {
                                                                                        if (!err) {
                                                                                            monthCount.push(count);
                                                                                            Order.countDocuments({
                                                                                                "orderedAt": {
                                                                                                    "$gte": new Date(year, 11, 1, 0, 0, 0, 0),
                                                                                                    "$lt": new Date(year, 11, 31, 23, 59, 59, 59)
                                                                                                }
                                                                                            }, (err, count) => {
                                                                                                if (!err) {
                                                                                                    monthCount.push(count);
                                                                                                    req.body.monthCount = monthCount;
                                                                                                    next();
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    });
                                                                                }
                                                                            });

                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

var counts;
getCounts = (req, res, next) => {
    counts = [];
    Plant.countDocuments({}, (err, count) => {
        if (!err) {
            counts.push({
                plantCount: count
            });
            User.countDocuments({
                isAdmin: false
            }, (err, count) => {
                if (!err) {
                    counts.push({
                        userCount: count
                    });
                    Order.countDocuments({}, (err, count) => {
                        if (!err) {
                            counts.push({
                                orderCount: count
                            });
                            currentDate = new Date(Date.now());
                            year = currentDate.getFullYear();
                            month = currentDate.getMonth();
                            Order.countDocuments({
                                "orderedAt": {
                                    "$gte": new Date(year, month, 1, 0, 0, 0, 0),
                                    "$lt": new Date(year, month, 30, 23, 59, 59, 59)
                                }
                            }, (err, count) => {
                                if (!err) {
                                    counts.push({
                                        orderCount: count
                                    });
                                    req.body.counts = counts;
                                    next();
                                }
                            });
                        }
                    });
                }
            });
        }
    });

}
module.exports = {
    getCounts,
    getMonthCounts
};