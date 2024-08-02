import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  order: {},
  userOrders: [],
  adminOrders: [],
  orderDetails: {
    loading: false,
    order: {},
    error: null,
  },
  error: null,
  isOrderDeleted: false,
  isOrderUpdated: false
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    createOrderRequest: (state) => {
      state.loading = true;
    },
    createOrderSuccess: (state, action) => {
      state.loading = false;
      state.order = action.payload;
    },
    createOrderFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    userOrdersRequest: (state) => {
      state.loading = true;
    },
    userOrdersSuccess: (state, action) => {
      state.loading = false;
      state.userOrders = action.payload;
    },
    userOrdersFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    orderDetailsRequest: (state) => {
      state.orderDetails.loading = true;
      state.orderDetails.error = null;
    },
    orderDetailsSuccess: (state, action) => {
      state.orderDetails.loading = false;
      state.orderDetails.order = action.payload;
      state.orderDetails.error = null;
    },
    orderDetailsFail: (state, action) => {
      state.orderDetails.loading = false;
      state.orderDetails.error = action.payload;
    },
    adminOrdersRequest: (state) => {
      state.loading = true;
    },
    adminOrdersSuccess: (state, action) => {
      state.loading = false;
      state.adminOrders = action.payload.orders;
    },
    adminOrdersFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteOrderRequest: (state) => {
      state.loading = true;
    },
    deleteOrderSuccess: (state) => {
      state.loading = false;
      state.isOrderDeleted = true;
    },
    deleteOrderFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateOrderRequest: (state) => {
      state.loading = true;
    },
    updateOrderSuccess: (state) => {
      state.loading = false;
      state.isOrderUpdated = true;
    },
    updateOrderFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearOrderDeleted: (state) => {
      state.isOrderDeleted = false;
    },
    clearOrderUpdated: (state) => {
      state.isOrderUpdated = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
});

export const {
  createOrderRequest,
  createOrderSuccess,
  createOrderFail,
  userOrdersRequest,
  userOrdersSuccess,
  userOrdersFail,
  orderDetailsRequest,
  orderDetailsSuccess,
  orderDetailsFail,
  adminOrdersRequest,
  adminOrdersSuccess,
  adminOrdersFail,
  deleteOrderRequest,
  deleteOrderSuccess,
  deleteOrderFail,
  updateOrderRequest,
  updateOrderSuccess,
  updateOrderFail,
  clearOrderDeleted,
  clearOrderUpdated,
  clearError // Add clearError to the exports
} = orderSlice.actions;

export default orderSlice.reducer;


