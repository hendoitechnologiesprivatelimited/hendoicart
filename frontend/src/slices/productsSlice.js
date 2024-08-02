import { createSlice } from '@reduxjs/toolkit';

const productsSlice = createSlice({
    name: 'products',
    initialState: {
      loading: false,
      products: [],
      productsCount: 0,
      resPerPage: 0,
      error: null
    },
    reducers: {
      productsRequest(state) {
        state.loading = true;
        state.error = null;
      },
      productsSuccess(state, action) {
        state.loading = false;
        state.products = action.payload.products;
        state.productsCount = action.payload.count;
        state.resPerPage = action.payload.resPerPage;
        state.error = null;
      },
      productsFail(state, action) {
        state.loading = false;
        state.error = action.payload;
      },
      adminProductsRequest(state) {
        state.loading = true;
        state.error = null;
      },
      adminProductsSuccess(state, action) {
        state.loading = false;
        state.products = action.payload.products;
        state.error = null;
      },
      adminProductsFail(state, action) {
        state.loading = false;
        state.error = action.payload;
      },
      clearError(state) {
        state.error = null;
      }
    }
  });
  
  const { actions, reducer } = productsSlice;
  export const { productsRequest, productsSuccess, productsFail, adminProductsRequest, adminProductsSuccess, adminProductsFail, clearError } = actions;
  export default reducer;
  
