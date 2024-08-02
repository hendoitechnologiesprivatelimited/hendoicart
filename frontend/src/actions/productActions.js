import axios from 'axios';
import { productsSuccess, productsFail, productsRequest, adminProductsRequest, adminProductsSuccess, adminProductsFail } from "../slices/productsSlice";
import { productSuccess, productFail, productRequest, createReviewRequest, createReviewSuccess, createReviewFail, newProductRequest, newProductSuccess, newProductFail, deleteProductRequest, deleteProductSuccess, deleteProductFail, updateProductRequest, updateProductSuccess, updateProductFail, reviewsRequest, reviewsSuccess, reviewsFail, deleteReviewRequest, deleteReviewSuccess, deleteReviewFail } from '../slices/productSlice';

export const getProducts = (keyword, price, category, rating, currentPage) => async (dispatch) => {
    try {
        dispatch(productsRequest());
        let link = `/api/v1/products?page=${currentPage}`;

        if (keyword) {
            link += `&keyword=${keyword}`;
        }

        if (price && Array.isArray(price) && price.length === 2) {
            link += `&price[gte]=${price[0]}&price[lte]=${price[1]}`;
        }

        // Only add the category parameter if it is not null or an empty string
        if (category !== null && category !== '') {
            link += `&category=${category}`;
        }

        if (rating) {
            link += `&ratings=${rating}`;
        }

        const { data } = await axios.get(link);
        dispatch(productsSuccess(data));
    } catch (error) {
        console.error('Error fetching products:', error);
        dispatch(productsFail(error.response ? error.response.data.message : error.message));
    }
};

export const getProduct = (id) => async (dispatch) => {
    try {
        dispatch(productRequest());
        const { data } = await axios.get(`/api/v1/product/${id}`);
        console.log('API Response:', data); // Log API response
        dispatch(productSuccess({ product: data.product })); // Adjust to match expected structure
    } catch (error) {
        console.error('API Error:', error); // Log API error
        dispatch(productFail({ message: error.response ? error.response.data.message : error.message }));
    }
};

export const createReview = (reviewData) => async (dispatch) => {
    try {
        dispatch(createReviewRequest());
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        };
        const { data } = await axios.put('/api/v1/review', reviewData, config);
        dispatch(createReviewSuccess(data)); // Adjust to match expected structure
    } catch (error) {
        dispatch(createReviewFail(error.response.data.message));
    }
};

export const getAdminProducts = () => async (dispatch) => {
    try {
        dispatch(adminProductsRequest());
        const { data } = await axios.get('/api/v1/admin/products');
        dispatch(adminProductsSuccess(data));
    } catch (error) {
        console.error('Error fetching products:', error);
        dispatch(adminProductsFail(error.response ? error.response.data.message : error.message));
    }
};

export const createNewProduct = (productData) => async (dispatch) => {
    try {
        dispatch(newProductRequest());
        const { data } = await axios.post('/api/v1/admin/product/new', productData);
        dispatch(newProductSuccess(data));
    } catch (error) {
        console.error('Error creating product:', error);
        dispatch(newProductFail(error.response ? error.response.data.message : error.message));
    }
};

export const deleteProduct = (id) => async (dispatch) => {
    try {
        dispatch(deleteProductRequest());
        await axios.delete(`/api/v1/admin/product/${id}`);
        dispatch(deleteProductSuccess());
    } catch (error) {
        dispatch(deleteProductFail(error.response.data.message));
    }
};

export const updateProduct = (id, productData) => async (dispatch) => {
    try {
        dispatch(updateProductRequest());
        const { data } = await axios.put(`/api/v1/admin/product/${id}`, productData);
        dispatch(updateProductSuccess(data));
    } catch (error) {
        console.error('Error creating product:', error);
        dispatch(updateProductFail(error.response ? error.response.data.message : error.message));
    }
};

export const getReviews = (id) => async (dispatch) => {
    try {
        dispatch(reviewsRequest());
        const { data } = await axios.get(`/api/v1/admin/reviews`, { params: { id } });
        dispatch(reviewsSuccess(data));
    } catch (error) {
        dispatch(reviewsFail(error.response?.data?.message || error.message));
    }
};


export const deleteReview =  (productId, id) => async (dispatch) => {
    try {
        dispatch(deleteReviewRequest());
               
        await axios.delete('/api/v1/admin/review', {params: {productId,id}});
        dispatch(deleteReviewSuccess());
    } catch (error) {
        
        dispatch(deleteReviewFail( error.response.data.message ));
    }
};