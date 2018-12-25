var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var inventorySchema = new mongoose.Schema({
    _id: ObjectId,
    name:
    {
        type: String,
        unique: true
    },
    quantity: Number,
    details: String,
    price: Number
});
mongoose.model('Inventory', inventorySchema, 'inventory');