import React, { Fragment, useEffect } from 'react';
import MetaData from '../layouts/MetaData';
import { useSelector } from 'react-redux';
import { validateShipping } from './Shipping'; // Adjust the import path if necessary
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../slices/cartSlice';
import { useDispatch } from 'react-redux';
import CheckoutSteps from './CheckoutStep';
import axios from 'axios';

export default function Checkout() {
    const { shippingInfo, items: cartItems } = useSelector(state => state.cartState);
    const { user } = useSelector(state => state.authState); // Assuming authState holds the user information
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingPrice = itemsPrice > 200 ? 0 : 25;
    let taxPrice = Number((0.05 * itemsPrice).toFixed(2));
    const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

    const handlePayment = async () => {
        try {
            const orderResponse = await axios.post('/api/v1/checkout', {
                totalPrice: totalPrice,
                cartItems: cartItems,
                user: user,
                shippingInfo: {
                    ...shippingInfo,
                    phoneno: shippingInfo.phoneno || shippingInfo.phone || shippingInfo.phoneNo
                }
            });

            const { orderId, amount: orderAmount } = orderResponse.data;

            var options = {
                "key": "rzp_test_Fp82M8954Tnv2M",
                "amount": orderAmount * 100,
                "currency": "INR",
                "name": "Hendoi Cart",
                "description": "Test Transaction",
                "order_id": orderId, // Pass the orderId obtained from the response
                "handler": async function (response) {
                    const paymentData = {
                        orderId: orderId, // Use the correct orderId here
                        paymentId: response.razorpay_payment_id,
                        signature: response.razorpay_signature,
                        amount: orderAmount,
                        orderItems: cartItems,
                        userId: user._id,
                        userAddress: {
                            ...shippingInfo,
                            phoneno: shippingInfo.phoneno || shippingInfo.phone || shippingInfo.phoneNo
                        },
                        itemsPrice,
                        taxPrice,
                        shippingPrice,
                        totalPrice
                    };

                    try {
                        const api = await axios.post('/api/v1/verify-payment', paymentData);
                        console.log("Razorpay.response", api.data);

                        if (api && api.data.success) {
                            navigate('/order-success');
                            dispatch(clearCart());
                        } else {
                            alert('Payment verification failed. Please contact support.');
                        }
                    } catch (error) {
                        console.error('Payment verification failed:', error);
                        alert('Payment verification failed. Please contact support.');
                    }
                },
                "prefill": {
                    "name": "Hendoi Cart",
                    "email": "support@hendoi.com",
                    "contact": "9000090000"
                },
                "notes": {
                    "address": "Chennai-33"
                },
                "theme": {
                    "color": "#3399cc"
                }
            };
            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        validateShipping(shippingInfo);
    }, [shippingInfo]);

    console.log(shippingInfo); // Log shippingInfo to verify its structure

    return (
        <Fragment>
            <CheckoutSteps shipping confirmOrder />
            <MetaData title={'Checkout'} />
            <div className="row d-flex justify-content-between">
                <div className="col-12 col-lg-8 mt-5 order-confirm">
                    <h4 className="mb-3">Shipping Info</h4>
                    <p><b>Name:</b> {user.name}</p>
                    <p><b>Phone:</b> {shippingInfo.phoneno || shippingInfo.phone || shippingInfo.phoneNo}</p>
                    <p className="mb-4"><b>Address:</b> {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.postalCode}, {shippingInfo.state}, {shippingInfo.country}</p>

                    <hr />
                    <h4 className="mt-4">Your Cart Items:</h4>
                    <hr />
                    {cartItems.map(item => (
                        <div className="cart-item my-1" key={item.product}>
                            <div className="row">
                                <div className="col-4 col-lg-2">
                                    <img src={item.image} alt={item.name} height="45" width="65" />
                                </div>
                                <div className="col-5 col-lg-6">
                                    <a href={`/product/${item.product}`}>{item.name}</a>
                                </div>
                                <div className="col-4 col-lg-4 mt-4 mt-lg-0">
                                    <p>{item.quantity} x ₹{item.price} = <b>₹{(item.quantity * item.price).toFixed(2)}</b></p>
                                </div>
                            </div>
                        </div>
                    ))}
                    <hr />
                </div>

                <div className="col-12 col-lg-3 my-4">
                    <div id="order_summary">
                        <h4>Order Summary</h4>
                        <hr />
                        <p>Subtotal: <span className="order-summary-values">₹{itemsPrice.toFixed(2)}</span></p>
                        <p>Shipping: <span className="order-summary-values">₹{shippingPrice}</span></p>
                        <p>Tax: <span className="order-summary-values">₹{taxPrice}</span></p>
                        <hr />
                        <p>Total: <span className="order-summary-values">₹{totalPrice}</span></p>
                        <hr />
                        <button id="checkout_btn" onClick={handlePayment} className="btn btn-primary btn-block">Proceed to Payment</button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
