import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getOrderDetails, updateOrder } from '../../actions/orderActions';
import { toast } from 'react-toastify';
import Sidebar from './Sidebar';

export default function UpdateOrder() {
  const { isOrderUpdated, error, orderDetails } = useSelector(state => state.orderState);
  const { user = {}, orderItems = [], shippingInfo = {}, totalPrice = 0, paymentInfo = {} } = orderDetails.order || {};
  const [orderStatus, setOrderStatus] = useState('');

  const { id: orderId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrderDetails(orderId));
  }, [dispatch, orderId]);

  useEffect(() => {
    if (orderDetails.order) {
      setOrderStatus(prevStatus => orderDetails.order.orderStatus);
    }
  }, [orderDetails.order]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const orderData = { orderStatus };

    try {
      await dispatch(updateOrder(orderId, orderData));
      dispatch(getOrderDetails(orderId));

      let successMessage = '';
      switch (orderStatus) {
        case 'Shipped':
          successMessage = 'Order shipped successfully!';
          break;
        case 'Delivered':
          successMessage = 'Order delivered successfully!';
          break;
        default:
          successMessage = 'Order status updated successfully!';
          break;
      }

      toast.success(successMessage);
    } catch (err) {
      console.error('Update failed:', err.message);
      toast.error('Failed to update order status');
    }
  };

  return (
    <div className="row">
      <div className='col-12 col-md-2'>
        <Sidebar />
      </div>
      <div className='col-12 col-md-10'>
        <Fragment>
          <h2 style={styles.header}>Order Details</h2>
          <table style={styles.table}>
            <tbody>
              <tr>
                <th style={styles.th}>Order ID:</th>
                <td style={styles.td}>{orderDetails.order._id}</td>
              </tr>
              {user && (
                <tr>
                  <th style={styles.th}>User:</th>
                  <td style={styles.td}>{user.name} ({user.email})</td>
                </tr>
              )}
              {shippingInfo && (
                <>
                  <tr>
                    <th style={styles.th}>Shipping Address:</th>
                    <td style={styles.td}>{`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.country}, ${shippingInfo.state}, ${shippingInfo.postalCode}`}</td>
                  </tr>
                  <tr>
                    <th style={styles.th}>Phone:</th>
                    <td style={styles.td}>{shippingInfo.phone}</td>
                  </tr>
                  <tr>
                    <th style={styles.th}>Postal Code:</th>
                    <td style={styles.td}>{shippingInfo.postalCode}</td>
                  </tr>
                </>
              )}
              {orderItems && orderItems.length > 0 && (
                <tr>
                  <th style={styles.th}>Order Items:</th>
                  <td style={styles.td}>
                    <ul style={styles.ul}>
                      {orderItems.map(item => (
                        <li key={item._id} style={styles.li}>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                            <div>
                              <p style={styles.itemName}>{item.name}</p>
                              <p>Quantity: {item.quantity}</p>
                              <p>Price: ₹{item.price?.toFixed(2)}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
              <tr>
                <th style={styles.th}>Items Price:</th>
                <td style={styles.td}>₹{orderDetails.order.itemsPrice?.toFixed(2)}</td>
              </tr>
              <tr>
                <th style={styles.th}>Tax Price:</th>
                <td style={styles.td}>₹{orderDetails.order.taxPrice?.toFixed(2)}</td>
              </tr>
              <tr>
                <th style={styles.th}>Shipping Price:</th>
                <td style={styles.td}>₹{orderDetails.order.shippingPrice?.toFixed(2)}</td>
              </tr>
              <tr>
                <th style={styles.th}>Total Price:</th>
                <td style={styles.td}>₹{totalPrice?.toFixed(2)}</td>
              </tr>
              <tr>
                <th style={styles.th}>Payment ID:</th>
                <td style={styles.td}>{paymentInfo.id || 'N/A'}</td>
              </tr>
              <tr>
                <th style={styles.th}>Payment Status:</th>
                <td style={styles.td}>{paymentInfo.status || 'N/A'}</td>
              </tr>
              {orderDetails.order.paidAt && (
                <tr>
                  <th style={styles.th}>Paid At:</th>
                  <td style={styles.td}>{new Date(orderDetails.order.paidAt).toLocaleString()}</td>
                </tr>
              )}
              <tr>
                <th style={styles.th}>Order Status:</th>
                <td style={styles.td}>
                  <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
                    <option value="">Select Status</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
              {orderDetails.order.createdAt && (
                <tr>
                  <th style={styles.th}>Created At:</th>
                  <td style={styles.td}>{new Date(orderDetails.order.createdAt).toLocaleString()}</td>
                </tr>
              )}
            </tbody>
          </table>
          <button onClick={submitHandler}>Update Status</button>
          {error && <p style={styles.error}>{error}</p>}
          {isOrderUpdated && (
            <p style={styles.message}>Order status updated successfully!</p>
          )}
        </Fragment>
      </div>
    </div>
  );
}

const styles = {
  header: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '20px',
    textAlign: 'center',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginBottom: '20px',
  },
  th: {
    backgroundColor: '#f2f2f2',
    textAlign: 'left',
    padding: '12px',
    borderBottom: '1px solid #ddd',
    fontWeight: 'bold',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid #ddd',
  },
  ul: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  li: {
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
  },
  itemName: {
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  message: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#666',
  },
  error: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#ff0000',
  },
};


