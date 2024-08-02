import { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';

import { deleteOrder, getAdminOrders } from "../../actions/orderActions";
import Loader from '../layouts/Loader';
import { MDBDataTable } from 'mdbreact';
import Sidebar from './Sidebar';
import { clearError, clearOrderDeleted } from '../../slices/orderSlice';

export default function OrderList() {
  const { adminOrders = [], loading, error, isOrderDeleted } = useSelector(state => state.orderState);

  const dispatch = useDispatch();

  const setOrders = () => {
    const data = {
      columns: [
        { label: 'ID', field: 'id', sort: 'asc' },
        { label: 'Number of Items', field: 'noOfItems', sort: 'asc' },
        { label: 'Amount', field: 'amount', sort: 'asc' },
        { label: 'Status', field: 'status', sort: 'asc' },
        { label: 'Action', field: 'action', sort: 'asc' }
      ],
      rows: []
    };

    adminOrders.forEach(order => {
      data.rows.push({
        id: order._id,
        noOfItems: order.orderItems.length,
        amount: `₹${order.totalPrice}`,
        status: <p style={{color: order.orderStatus.includes('Processing') ? 'red' : 'green'}}>{order.orderStatus}</p>,
        action: (
          <Fragment>
            <Link to={`/admin/order/${order._id}`} className='btn btn-primary'>
              <i className="fa fa-pencil"></i>
            </Link>
            <Button onClick={e => deleteHandler(e, order._id)} className="btn btn-danger py-1 px-2 ml-2">
              <i className="fa fa-trash"></i>
            </Button>
          </Fragment>
        )
      });
    });

    return data;
  };

  const deleteHandler = (e, id) => {
    e.target.disabled = true;
    dispatch(deleteOrder(id));
  };

  useEffect(() => {
    if (error) {
      toast.error(error, {
        onClose: () => { dispatch(clearError()) }
      });
    }

    if (isOrderDeleted) {
      toast.success('Order Deleted Successfully!', {
        onClose: () => dispatch(clearOrderDeleted())
      });
      // Refetch the orders after deletion
      dispatch(getAdminOrders());
    }

    dispatch(getAdminOrders());
  }, [dispatch, error, isOrderDeleted]);

  return (
    <div className='row'>
      <div className="col-12 col-md-2">
        <Sidebar />
      </div>
      <div className="col-12 col-md-10">
        <h1 className="my-4">Order List</h1>
        <Fragment>
          {loading ? <Loader /> : (
            <MDBDataTable
              data={setOrders()}
              bordered
              striped
              hover
              className="px-3"
            />
          )}
        </Fragment>
      </div>
    </div>
  );
}

