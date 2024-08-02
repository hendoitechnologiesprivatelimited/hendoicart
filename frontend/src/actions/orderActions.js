import axios from 'axios';
import { 
  createOrderFail, 
  createOrderRequest, 
  createOrderSuccess, 
  userOrdersFail, 
  userOrdersRequest, 
  userOrdersSuccess,
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
  updateOrderFail
} from "../slices/orderSlice";

export const createOrder = (order) => async (dispatch) => {
  try {
      console.log('Dispatching createOrderRequest...');
      dispatch(createOrderRequest());
      const { data } = await axios.post('/api/v1/order/new', order);
      console.log('Received createOrderSuccess response:', data);
      dispatch(createOrderSuccess(data));
  } catch (error) {
      console.error('Error in createOrder:', error);
      dispatch(createOrderFail(error.response.data.message));
  }
};


// Fetch user orders action
export const getUserOrders = () => async (dispatch) => {
    try {
        dispatch(userOrdersRequest());
        const { data } = await axios.get('/api/v1/myorders');
        dispatch(userOrdersSuccess(data.orders)); // Assuming the backend returns orders array under 'orders' key
    } catch (error) {
        dispatch(userOrdersFail(error.response.data.message || error.message));
    }
};

export const getOrderDetails = (id) => async (dispatch) => {
  try {
    dispatch(orderDetailsRequest());
    const { data } = await axios.get(`/api/v1/order/${id}`);
    dispatch(orderDetailsSuccess(data.order));
  } catch (error) {
    dispatch(orderDetailsFail(error.response?.data?.message || 'An error occurred'));
  }
};

export const getAdminOrders = () => async (dispatch) => {
  try {
      dispatch(adminOrdersRequest());
      const { data } = await axios.get('/api/v1/admin/orders');
      dispatch(adminOrdersSuccess(data)); 
  } catch (error) {
      dispatch(adminOrdersFail(error.response.data.message || error.message));
  }
};

export const deleteOrder = id => async (dispatch) => {
  try {
      dispatch(deleteOrderRequest());
      await axios.delete(`/api/v1/admin/order/${id}`);
      dispatch(deleteOrderSuccess()); 
  } catch (error) {
      dispatch(deleteOrderFail(error.response.data.message || error.message));
  }
};

export const updateOrder = (id, orderData) => async (dispatch) => {
  try {
      dispatch(updateOrderRequest());
      const { data } = await axios.put(`/api/v1/admin/order/${id}`, orderData);
      dispatch(updateOrderSuccess(data)); 
  } catch (error) {
      dispatch(updateOrderFail(error.response.data.message || error.message));
  }
};
