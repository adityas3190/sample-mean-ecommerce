var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var addressSchema = new mongoose.Schema({
    room_no: String, // Can be something like A1 / B2,
    building: String,
    street: String,
    landmark: String,
    city: String,
    state: String,
    country: String,
    postal_code: String
});
var accountSchema = new mongoose.Schema({
    _id: ObjectId,
    name: String,
    age: Number,
    email: {
        type: String,
        unique: true
    },
    contact_no: {
        type: String,
        unique: true
    }, // Makes no sense to  be a number since we won't compute anything on it
    address: addressSchema
});
mongoose.model('Account', accountSchema, 'account');