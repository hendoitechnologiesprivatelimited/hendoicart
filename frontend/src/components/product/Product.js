import React from 'react';
import { Link } from 'react-router-dom';

export default function Product({ product, col }) {
  return (
    <div className={`col-sm-12 col-md-4 col-lg-${col} mb-4`} key={product._id}>
      <div className="card p-2 rounded" style={{ width: "100%" }}>
        <img
          className="card-img-top mx-auto"
          src={product.images[0].image}
          alt={product.name}
          style={{ maxWidth: "100%", height: "auto" }} // Ensure image responsiveness
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">
            <Link to={`/product/${product._id}`}>{product.name}</Link>
          </h5>
          <div className="ratings mt-auto">
            <div className="rating-outer">
              <div className="rating-inner" style={{ width: `${(product.ratings / 5) * 100}%` }}></div>
            </div>
          </div>
          <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>
          <p className="card-text">₹{product.price}</p>
          <Link to={`/product/${product._id}`} id="view_btn" className="btn btn-block">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
