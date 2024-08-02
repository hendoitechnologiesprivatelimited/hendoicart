import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name: 'product',
    initialState: {
        loading: false,
        product: {},
        error: null,
        isReviewSubmitted: false,
        isProductCreated: false,
        isProductDeleted: false,
        isProductUpdated: false,
        isReviewDeleted: false,
        reviews: []
    },
    reducers: {
        productRequest(state) {
            state.loading = true;
            state.error = null;
        },
        productSuccess(state, action) {
            state.loading = false;
            state.product = action.payload.product;
            state.error = null;
        },
        productFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        createReviewRequest(state) {
            state.loading = true;
            state.error = null;
        },
        createReviewSuccess(state) {
            state.loading = false;
            state.isReviewSubmitted = true;
            state.error = null;
        },
        createReviewFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        clearReviewSubmitted(state) {
            state.isReviewSubmitted = false;
        },
        clearError(state) {
            state.error = null;
        },
        clearProduct(state) {
            state.product = {};
        },
        newProductRequest(state) {
            state.loading = true;
            state.error = null;
        },
        newProductSuccess(state, action) {
            state.loading = false;
            state.product = action.payload.product;
            state.error = null;
            state.isProductCreated = true;
        },
        newProductFail(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.isProductCreated = false;
        },
        clearProductCreated(state) {
            state.isProductCreated = false;
        },
        deleteProductRequest(state) {
            state.loading = true;
            state.error = null;
        },
        deleteProductSuccess(state) {
            state.loading = false;
            state.isProductDeleted = true;
        },
        deleteProductFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        clearProductDeleted(state) {
            state.isProductDeleted = false;
        },
        updateProductRequest(state) {
            state.loading = true;
            state.error = null;
        },
        updateProductSuccess(state, action) {
            state.loading = false;
            state.product = action.payload.product;
            state.error = null;
            state.isProductUpdated = true;
        },
        updateProductFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        clearProductUpdated(state) {
            state.isProductUpdated = false;
        },
        reviewsRequest(state) {
            state.loading = true;
            state.error = null;
        },
        reviewsSuccess(state, action) {
            state.loading = false;
            state.reviews = action.payload.reviews;
            state.error = null;
        },
        reviewsFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        deleteReviewRequest(state) {
            state.loading = true;
            state.error = null;
        },
        deleteReviewSuccess(state) {
            state.loading = false;
            state.isReviewDeleted = true;
        },
        deleteReviewFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        clearReviewDeleted(state) {
            state.isReviewDeleted = false;
        }
    }
});

export const { 
    productRequest, 
    productSuccess, 
    productFail, 
    createReviewRequest, 
    createReviewSuccess, 
    createReviewFail, 
    clearError, 
    clearReviewSubmitted, 
    clearProduct,
    newProductRequest,
    newProductSuccess,
    newProductFail,
    clearProductCreated,
    deleteProductRequest,
    deleteProductSuccess,
    deleteProductFail,
    clearProductDeleted,
    updateProductRequest,
    updateProductSuccess,
    updateProductFail,
    clearProductUpdated,
    reviewsRequest,
    reviewsSuccess,
    reviewsFail,
    deleteReviewRequest,
    deleteReviewSuccess,
    deleteReviewFail,
    clearReviewDeleted
} = productSlice.actions;

export default productSlice.reducer;



