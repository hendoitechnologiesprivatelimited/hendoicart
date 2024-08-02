const catchAsyncError = require('../middlewares/catchAsyncError');
const Order = require('../models/orderModel');
const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const Product = require('../models/productModel');

exports.newOrder = catchAsyncError(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user.id
    });

    res.status(201).json({
        success: true,
        order
    });
});
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        order
    });
});

exports.myOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({ user: req.user.id });

    res.status(200).json({
        success: true,
        orders
    });
});

exports.orders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    });
});

exports.updateOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404));
    }

    if (order.orderStatus === 'Delivered') {
        return next(new ErrorHandler('Order has already been delivered', 400));
    }

    // Only update stock if the order status is being changed to 'Delivered'
    if (req.body.orderStatus === 'Delivered') {
        await Promise.all(order.orderItems.map(orderItem => updateStock(orderItem.product, orderItem.quantity)));
        order.deliveredAt = Date.now();
    }

    order.orderStatus = req.body.orderStatus;
    await order.save();

    // Fetch the updated order with populated user information
    const updatedOrder = await Order.findById(req.params.id).populate('user', 'name email');

    res.status(200).json({
        success: true,
        order: updatedOrder
    });
});

async function updateStock(productId, quantity) {
    const product = await Product.findById(productId);
    if (!product) {
        throw new ErrorHandler('Product not found', 404);
    }
    product.stock = product.stock - quantity;
    await product.save({ validateBeforeSave: false });
}

exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404));
    }

    await Order.deleteOne({ _id: req.params.id });
    res.status(200).json({
        success: true
    });
});
