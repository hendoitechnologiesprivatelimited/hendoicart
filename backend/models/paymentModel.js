const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    orderDate: { type: Date, default: Date.now },
    payStatus: { type: String },
    orderId: { type: String, required: true },
    paymentId: { type: String, required: true },
    signature: { type: String, required: true },
    amount: { type: Number, required: true },
    orderItems: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            image: { type: String, required: true },
            stock: { type: Number, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        phone: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        state: { type: String, required: true }
    }
}, { strict: false });

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = { Payment };
