const { Payment } = require('../models/paymentModel');
const Razorpay = require('razorpay');
const Order = require('../models/orderModel');

var instance = new Razorpay({
    key_id: 'rzp_test_Fp82M8954Tnv2M',
    key_secret: 'yIefLKcODlh1yAejW3g7Bp7q'
});

// Checkout
exports.checkout = async (req, res) => {
    const { totalPrice, cartItems, user, shippingInfo } = req.body;

    var options = {
        amount: totalPrice * 100,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`
    };

    const order = await instance.orders.create(options);
    res.json({
        orderId: order.id,
        amount: totalPrice,
        cartItems,
        user,
        shippingInfo,
        payStatus: 'created'
    });
};

// Verify and save to DB
exports.verify = async (req, res) => {
    const {
        orderId,
        paymentId,
        signature,
        amount,
        orderItems,
        userId,
        userAddress,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    try {
        // Create payment record
        let orderConfirm = await Payment.create({
            orderId,
            paymentId,
            signature,
            amount,
            orderItems,
            userId,
            userAddress,
            payStatus: 'paid',
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            orderDate: Date.now()
        });

        // Create order record
        const newOrder = await Order.create({
            orderItems,
            shippingInfo: userAddress,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paymentInfo: {
                id: paymentId,
                status: 'success'  // <-- Set payment status here
            },
            paidAt: Date.now(),
            orderStatus: 'Processing',
            user: userId
        });

        res.json({
            message: 'Payment successful and order created...',
            success: true,
            orderConfirm,
            newOrder
        });
    } catch (error) {
        console.error('Error processing payment and order:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
