var mongoose = require('mongoose');
var async = require('async');
var InventoryModel = mongoose.model('Inventory');
var AccountModel = mongoose.model('Account');
var fakeAccountData = require('../data/account-fake');
var OrderModel = mongoose.model('Order');

function generateRandomInventorySchema() {
    return {
        name: generate_random_string(10),
        details: generate_random_string(100),
        quantity: Math.floor(Math.random() * 5000) + 1,
        price: Math.floor(Math.random() * 5000) + 1
    }
}
function generate_random_string(string_length) {
    let random_string = '';
    let random_ascii;
    for (let i = 0; i < string_length; i++) {
        random_ascii = Math.floor((Math.random() * 25) + 97);
        random_string += String.fromCharCode(random_ascii)
    }
    return random_string
}
function prefillData(req, res) {
    var inventoryNumber = req.query.number;
    var inventoryData = [];
    for (var i = 0; i < inventoryNumber; i++) {
        inventoryData.push(generateRandomInventorySchema());
    }
    async.parallel([
        function (callback) {
            InventoryModel.insertMany(inventoryData, function (err, docs) {
                if (err) {
                    return callback(err);
                }
                return callback();
            });
        },
        function (callback) {
            console.log("Fake account data", fakeAccountData);
            AccountModel.insertMany(fakeAccountData.fakeAccountData, function (err, docs) {
                if (err) {
                    return callback(err);
                }
                return callback();
            });
        }
        // TODO : Orders can be automated here
    ], function (err) {
        if (err) {
            res.status(400).json(generateErrorMessage(err));
            return;
        }
        res.status(200).json(generateSuccessMessage(inventoryNumber + " items inserted"));
    });


}
function order(req, res) {
    var accountId = req.body.accountId;
    var items = req.body.items;
    AccountModel.findById(accountId, function (err, account) {
        if (err) {
            return res.status(400).json(generateErrorMessage(err));
        }
        if (!account) {
            return res.status(404).json(generateSuccessMessage('No account found with this id'));
        }
        var itemData = [];
        var totalPrice = 0;
        async.eachSeries(items, function (item, callback) {
            console.log("Item id" , item);
            InventoryModel.findById(item.id, function (err, inventory) {
                if (err) {
                    return res.status(400).json(generateErrorMessage(err));
                }
                if (!inventory) {
                    return res.status(404).json(generateSuccessMessage('No item found with this id'));
                }
                if (item.quantity > inventory.quantity) {
                    return res.status(200).json(generateSuccessMessage(inventory.name + ' only has ' + inventory.quantity + ' . Please update'));
                }
                const price = item.quantity * inventory.price;
                const itemObject = {
                    _id : item.id,
                    quantity: item.quantity,
                    price: price
                }
                itemData.push(itemObject);
                totalPrice += price;
                const remainingQuantity = inventory.quantity - item.quantity;
                InventoryModel.findByIdAndUpdate(item.id , {$set : {quantity :remainingQuantity}} , function(err) {
                    if (err) {
                        return res.status(400).json(generateErrorMessage(err));
                    }
                    return callback();
                });
                
            });
        }, function (err) {
            if (err) {
                return res.status(400).json(generateErrorMessage(err));
            }
            const orderObject = {
                items: itemData,
                accountId: accountId,
                total_price: totalPrice
            }
            const doc = new OrderModel(orderObject);
            doc.save()
                .then(() => { return res.status(200).json(generateSuccessMessage("Order placed succesfully")) })
                .catch((err) => {
                    return res.status(400).json(generateErrorMessage(err));
                })
        });
    })
}
function generateErrorMessage(err) {
    return {
        msg: "Something went wrong",
        err: err
    }
}
function generateSuccessMessage(message) {
    return {
        msg: message
    }
}
module.exports = {
    prefillData: prefillData,
    order: order
}