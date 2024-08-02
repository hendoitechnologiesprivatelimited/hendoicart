import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetails } from '../../actions/orderActions';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { loading, error, order } = useSelector((state) => state.orderState.orderDetails);

  useEffect(() => {
    if (id) {
      dispatch(getOrderDetails(id));
    }
  }, [dispatch, id]);

  console.log('Redux state:', { loading, order, error });

  if (loading) {
    return <p style={styles.message}>Loading order details...</p>;
  }

  if (error) {
    console.error('Error fetching order details:', error);
    return <p style={styles.error}>Error: {error}</p>;
  }

  if (!order || Object.keys(order).length === 0) {
    return <p style={styles.message}>Order not found or empty</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Order Details</h2>
      <table style={styles.table}>
        <tbody>
          <tr>
            <th style={styles.th}>Order ID:</th>
            <td style={styles.td}>{order._id}</td>
          </tr>
          {order.user && (
            <tr>
              <th style={styles.th}>User:</th>
              <td style={styles.td}>{order.user.name} ({order.user.email})</td>
            </tr>
          )}
          {order.shippingInfo && (
            <>
              <tr>
                <th style={styles.th}>Shipping Address:</th>
                <td style={styles.td}>{order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.country}, {order.shippingInfo.state}, {order.shippingInfo.postalCode}</td>
              </tr>
              <tr>
                <th style={styles.th}>Phone:</th>
                <td style={styles.td}>{order.shippingInfo.phone}</td>
              </tr>
              <tr>
                <th style={styles.th}>Postal Code:</th>
                <td style={styles.td}>{order.shippingInfo.postalCode}</td>
              </tr>
            </>
          )}
          {order.orderItems && order.orderItems.length > 0 && (
            <tr>
              <th style={styles.th}>Order Items:</th>
              <td style={styles.td}>
                <ul style={styles.ul}>
                  {order.orderItems.map(item => (
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
            <td style={styles.td}>₹{order.itemsPrice?.toFixed(2)}</td>
          </tr>
          <tr>
            <th style={styles.th}>Tax Price:</th>
            <td style={styles.td}>₹{order.taxPrice?.toFixed(2)}</td>
          </tr>
          <tr>
            <th style={styles.th}>Shipping Price:</th>
            <td style={styles.td}>₹{order.shippingPrice?.toFixed(2)}</td>
          </tr>
          <tr>
            <th style={styles.th}>Total Price:</th>
            <td style={styles.td}>₹{order.totalPrice?.toFixed(2)}</td>
          </tr>
          <tr>
            <th style={styles.th}>Payment ID:</th>
            <td style={styles.td}>{order.paymentInfo?.id || 'N/A'}</td>
          </tr>
          <tr>
            <th style={styles.th}>Payment Status:</th>
            <td style={styles.td}>{order.paymentInfo?.status || 'N/A'}</td>
          </tr>
          {order.paidAt && (
            <tr>
              <th style={styles.th}>Paid At:</th>
              <td style={styles.td}>{new Date(order.paidAt).toLocaleString()}</td>
            </tr>
          )}
          <tr>
            <th style={styles.th}>Order Status:</th>
            <td style={styles.td}>{order.orderStatus}</td>
          </tr>
          {order.createdAt && (
            <tr>
              <th style={styles.th}>Created At:</th>
              <td style={styles.td}>{new Date(order.createdAt).toLocaleString()}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
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

export default OrderDetails;
