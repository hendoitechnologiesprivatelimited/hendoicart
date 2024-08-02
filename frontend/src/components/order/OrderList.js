import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserOrders } from '../../actions/orderActions';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const OrderList = () => {
  const dispatch = useDispatch();

  // Access the user orders from Redux state
  const { loading, error, userOrders } = useSelector((state) => state.orderState);

  useEffect(() => {
    // Dispatch action to fetch user orders when component mounts
    dispatch(getUserOrders());
  }, [dispatch]);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>My Orders</h2>
      {loading ? (
        <p style={styles.message}>Loading...</p>
      ) : error ? (
        <p style={styles.message}>Error: {error}</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>S.No</th>
              <th style={styles.tableHeader}>Order ID</th>
              <th style={styles.tableHeader}>Total Price</th>
              <th style={styles.tableHeader}>Total Order Qty</th>
              <th style={styles.tableHeader}>Order Status</th>
              <th style={styles.tableHeader}>Details</th>
            </tr>
          </thead>
          <tbody>
            {userOrders.length === 0 ? (
              <tr>
                <td colSpan="6" style={styles.noOrders}>No orders found.</td>
              </tr>
            ) : (
              userOrders.map((order, index) => (
                <tr key={order._id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{index + 1}</td>
                  <td style={styles.tableCell}>{order._id}</td>
                  <td style={styles.tableCell}>₹{order.totalPrice}</td>
                  <td style={styles.tableCell}>{order.orderItems.reduce((acc, item) => acc + item.quantity, 0)}</td>
                  <td style={styles.tableCell}>{order.orderStatus}</td>
                  <td style={styles.tableCell}>
                    <Link to={`/order/${order._id}`}>
                      <FontAwesomeIcon icon={faEye} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    margin: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  message: {
    textAlign: 'center',
    color: '#ff0000',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px',
    textAlign: 'left',
  },
  tableRow: {
    backgroundColor: '#ffffff',
  },
  tableCell: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  },
  noOrders: {
    textAlign: 'center',
    padding: '20px',
  },
};

export default OrderList;


