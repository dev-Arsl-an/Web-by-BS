const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    cardDetails: {
        cardNumber: { type: String },
        expirationDate: { type: String },
        cvv: { type: String }
    },
    orderSummary: {
        subtotal: { type: Number, required: true },
        shipping: { type: Number, required: true },
        tax: { type: Number, required: true },
        total: { type: Number, required: true }
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
