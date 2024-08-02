import React, { Fragment, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProduct, createReview } from '../../actions/productActions';
import Loader from '../layouts/Loader';
import MetaData from '../layouts/MetaData';
import { Carousel, Modal } from 'react-bootstrap';
import { addCartItem } from '../../actions/cartActions';
import { clearError, clearReviewSubmitted } from '../../slices/productSlice';
import { toast } from 'react-toastify';
import ProductReview from './ProductReview';

export default function ProductDetail() {
    const { loading, product, error, isReviewSubmitted } = useSelector((state) => state.productState);
    const { user } = useSelector(state => state.authState);
    const dispatch = useDispatch();
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [show, setShow] = useState(false);
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState("");

    const increaseQty = () => {
        const count = document.querySelector('.count');
        if (product.stock === 0 || count.valueAsNumber >= product.stock) return;
        setQuantity(count.valueAsNumber + 1);
    };

    const decreaseQty = () => {
        const count = document.querySelector('.count');
        if (count.valueAsNumber === 1) return;
        setQuantity(count.valueAsNumber - 1);
    };

    const reviewHandler = useCallback(() => {
        const formData = new FormData();
        formData.append('rating', rating);
        formData.append('comment', comment);
        formData.append('productId', id);
        dispatch(createReview(formData));
    }, [dispatch, id, rating, comment]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        console.log('useEffect called');
        
        if (isReviewSubmitted) {
            handleClose();
            toast('Review submitted successfully', {
                type: 'success',
                onOpen: () => dispatch(clearReviewSubmitted()),
            });
            // Since the review is submitted, fetch the updated product details including reviews
            dispatch(getProduct(id)); // Dispatch getProduct to update the product state
        }

        if (error) {
            toast.error(error, {
                onOpen: () => {
                    dispatch(clearError());
                },
            });
        }

        // Fetch the product details if product is not loaded or the ID has changed
        if (!product || product._id !== id) {
            console.log('Dispatching getProduct');
            dispatch(getProduct(id));
        }
    }, [dispatch, id, product, isReviewSubmitted, error]);

    console.log('Loading:', loading);
    console.log('Product:', product);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    if (!product || !product._id) {
        return <p>Product not found</p>;
    }

    return (
        <Fragment>
            <MetaData title={product.name} />
            <div className="row f-flex justify-content-around">
                <div className="col-12 col-lg-5 img-fluid" id="product_image">
                    <Carousel pause='hover'>
                        {product.images && product.images.map((image) =>
                            <Carousel.Item key={image._id}>
                                <img className="d-block w-100" src={image.image} alt={product.name} height="500" width="500" />
                            </Carousel.Item>
                        )}
                    </Carousel>
                </div>
                <div className="col-12 col-lg-5 mt-5">
                    <h3>{product.name}</h3>
                    <p id="product_id">Product # {product._id}</p>
                    <hr />
                    <div className="rating-outer">
                        <div className="rating-inner" style={{ width: `${(product.ratings / 5) * 100}%` }}></div>
                    </div>
                    <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>
                    <hr />
                    <p id="product_price">₹{product.price}</p>
                    <div className="stockCounter d-inline">
                        <span className="btn btn-danger minus" onClick={decreaseQty}>-</span>
                        <input type="number" className="form-control count d-inline" value={quantity} readOnly />
                        <span className="btn btn-primary plus" onClick={increaseQty}>+</span>
                    </div>
                    <button type="button" id="cart_btn"
                        disabled={product.stock === 0}
                        onClick={() => dispatch(addCartItem(product._id, quantity))}
                        className="btn btn-primary d-inline ml-4"
                    >Add to Cart</button>
                    <hr />
                    <p>Status: <span className={product.stock > 0 ? 'greenColor' : 'redColor'} id="stock_status">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></p>
                    <hr />
                    <h4 className="mt-2">Description:</h4>
                    <p>{product.description}</p>
                    <hr />
                    <p id="product_seller mb-3">Sold by: <strong>{product.seller}</strong></p>
                    
                    { user ?
                    <button onClick={handleShow} id="review_btn" type="button" className="btn btn-primary mt-4" data-toggle="modal" data-target="#ratingModal">Submit Your Review</button> :
                    <div className='alert alert-danger mt-5'>Login to post Review</div>
                    }

                    <div className="row mt-2 mb-5">
                        <div className="rating w-50">
                            <Modal show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Submit a Review</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <ul className="stars">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <li
                                                key={star}
                                                value={star}
                                                onClick={() => setRating(star)}
                                                className={`star ${star <= rating ? 'orange' : ''}`}
                                                onMouseOver={(e) => e.target.classList.add('yellow')}
                                                onMouseOut={(e) => e.target.classList.remove('yellow')}
                                            >
                                                <i className='fa fa-star'></i>
                                            </li>
                                        ))}
                                    </ul>
                                    <textarea onChange={(e) => setComment(e.target.value)} name="review" id="review" className="form-control mt-3"></textarea>
                                    <button disabled={loading} onClick={reviewHandler} aria-label="close" className='btn my-3 float-right review-btn px-4 text-white'>Submit</button>
                                </Modal.Body>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
            {
                product.reviews && product.reviews.length > 0 ?
                <ProductReview reviews={product.reviews}/> : null
            }
        </Fragment>
    );
}
