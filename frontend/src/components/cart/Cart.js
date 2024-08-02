import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeItemFromCart, increaseCartItemQty, decreaseCartItemQty } from '../../slices/cartSlice';

export default function Cart() {
    const { items } = useSelector(state => state.cartState);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Debugging: log the items
    console.log('Cart Items:', items);

    const handleIncreaseQty = (item) => {
        if (item.quantity < item.stock) {
            dispatch(increaseCartItemQty(item.product));
        }
    };

    const handleDecreaseQty = (item) => {
        if (item.quantity > 1) {
            dispatch(decreaseCartItemQty(item.product));
        }
    };

    const checkoutHandler = () => {
        navigate('/login?redirect=shipping')
    }

    return (
        <Fragment>
            {items.length === 0 ? (
                <h2 className="mt-5">Your Cart is Empty</h2>
            ) : (
                <Fragment>
                    <h2 className="mt-5">
                        Your Cart: <b>{items.length} item(s)</b>
                    </h2>

                    <div className="row d-flex justify-content-between">
                        <div className="col-12 col-lg-8">
                            {items.map(item => (
                                <div key={item.product}>
                                    <hr />
                                    <div className="cart-item">
                                        <div className="row">
                                            <div className="col-4 col-lg-3">
                                                {/* Debugging: log the image URL */}
                                                {console.log('Image URL:', item.image)}
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    height="90"
                                                    width="115"
                                                />
                                            </div>

                                            <div className="col-5 col-lg-3">
                                                <Link to={`/product/${item.product}`}>{item.name}</Link>
                                            </div>

                                            <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                                <p id="card_item_price">₹{item.price}</p>
                                            </div>

                                            <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                                <div className="stockCounter d-inline">
                                                    <span 
                                                        className="btn btn-danger minus"
                                                        onClick={() => handleDecreaseQty(item)}
                                                    >-</span>
                                                    <input
                                                        type="number"
                                                        className="form-control count d-inline"
                                                        value={item.quantity}
                                                        readOnly
                                                    />
                                                    <span 
                                                        className="btn btn-primary plus"
                                                        onClick={() => handleIncreaseQty(item)}
                                                    >+</span>
                                                </div>
                                            </div>

                                            <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                                                <i
                                                    id="delete_cart_item"
                                                    onClick={() => dispatch(removeItemFromCart(item.product))}
                                                    className="fa fa-trash btn btn-danger"
                                                ></i>
                                            </div>
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
                                <p>
                                    Subtotal: <span className="order-summary-values">{items.reduce((acc, item) => acc + item.quantity, 0)} item(s)</span>
                                </p>
                                <p>
                                    Est. total: <span className="order-summary-values">₹{items.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</span>
                                </p>
                                <hr />
                                <button id="checkout_btn" onClick = {checkoutHandler} className="btn btn-primary btn-block">
                                    Check out
                                </button>
                            </div>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
}
