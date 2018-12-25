var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var ItemSchema = new mongoose.Schema({
    _id : ObjectId,
    inventory_id : ObjectId,
    quantity : {
        type: Number,
        default:1
    },
    price : Number
});
var orderSchema = new mongoose.Schema({
    createdOn: {
        type: Date,
        default: Date.now()
    },
    items: [ItemSchema],
    account_id : ObjectId,
    total_price: Number
});
mongoose.model('Order', orderSchema, 'order');