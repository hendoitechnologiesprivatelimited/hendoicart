import React, { Fragment, useEffect, useState } from 'react';
import MetaData from './layouts/MetaData';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../actions/productActions';
import Loader from './layouts/Loader';
import Product from './product/Product';
import { toast } from 'react-toastify';
import Pagination from 'react-js-pagination';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import '.././App.css';

export default function Home() {
  const dispatch = useDispatch();
  const { products, loading, error, productsCount, resPerPage } = useSelector((state) => state.productsState);
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState([0, 1000]);
  const [rating, setRating] = useState(0);

  const setCurrentPageNo = (pageNo) => {
    setCurrentPage(pageNo);
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory === "" ? '' : selectedCategory);
  };

  const handlePriceChange = (value) => {
    setPrice(value);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      return;
    }

    dispatch(getProducts(null, price, category, rating, currentPage));
  }, [dispatch, error, currentPage, category, price, rating]); // Include rating in the dependency array


  return (
    <Fragment>
      <MetaData title="Buy Best Product" />
      <div className="container">
        <h1 id="products_heading">Latest Products</h1>
        <div className="row">
          <div className="col-md-3">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" className="form-control" value={category} onChange={handleCategoryChange}>
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Mobile Phones">Mobile Phones</option>
                <option value="Laptops">Laptops</option>
                <option value="Accessories">Accessories</option>
                <option value="Headphones">Headphones</option>
                <option value="Food">Food</option>
                <option value="Books">Books</option>
                <option value="Clothes/Shoes">Clothes/Shoes</option>
                <option value="Beauty/Health">Beauty/Health</option>
                <option value="Sports">Sports</option>
                <option value="Outdoor">Outdoor</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="price">Price Range</label>
              <Slider
                range
                min={0}
                max={1000}
                defaultValue={[0, 1000]}
                value={price}
                onChange={handlePriceChange}
                step={5}
                tipFormatter={(value) => <span>₹{value}</span>}
                handle={(props) => (
                  <Tooltip
                    overlayClassName="custom-tooltip" // Apply the custom tooltip class
                    overlay={<span>₹{props.value}</span>}
                    placement="top"
                    key={props.index}
                  >
                    <Slider.Handle value={props.value} {...props} />
                  </Tooltip>
                )}
              />

              <hr className='my-5' />

              <div className='mt-5'>
                <h6 className='mb-3'>Ratings</h6>
                <ul className='pl-0'>
                  {[5,4,3,2,1].map(star =>

                    <li
                      style={{ cursor: "pointer", listStyleType: "none" }}
                      key={star}
                      onClick={() => { setRating(star); }}
                    >
                     <div className='rating-outer'>

                      <div className='rating-inner' style={{width:`${star*20}%`}}>



                      </div>
                      
                      </div>
                    </li>

                  )}
                </ul>
              </div>

            </div>
          </div>
          <div className="col-md-9">
            {loading ? (
              <Loader />
            ) : error ? (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            ) : (
              <Fragment>
                <div className="row">
                  {products && products.length > 0 ? (
                    products.map((product) => (
                      <Product col={3} product={product} key={product._id} />
                    ))
                  ) : (
                    <div className="alert alert-warning mx-auto text-center" role="alert">
                      No products found.
                    </div>
                  )}
                </div>
                {productsCount > 0 && productsCount > resPerPage && (
                  <div className="d-flex justify-content-center mt-5">
                    <Pagination
                      activePage={currentPage}
                      itemsCountPerPage={resPerPage}
                      totalItemsCount={productsCount}
                      onChange={setCurrentPageNo}
                      nextPageText={'Next'}
                      prevPageText={'Prev'}
                      firstPageText={'First'}
                      lastPageText={'Last'}
                      itemClass="page-item"
                      linkClass="page-link"
                    />
                  </div>
                )}
              </Fragment>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
