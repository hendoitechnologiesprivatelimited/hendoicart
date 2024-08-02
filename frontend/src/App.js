import './App.css';
import Home from './components/Home';
import Footer from './components/layouts/Footer';
import Header from './components/layouts/Header';
import ProductDetail from './components/product/ProductDetail';
import ProductSearch from './components/product/ProductSearch';
import Login from './components/user/Login';
import Register from './components/user/Register';
import Profile from './components/user/Profile';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPassword from './components/user/ForgotPassword';
import ResetPassword from './components/user/ResetPassword';
import ProtectedRoute from './components/route/ProtectedRoute';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useEffect } from 'react';
import store from './store';
import { loadUser } from './actions/userActions';
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping';
import Checkout from './components/cart/Checkout';
import OrderSuccess from './components/cart/OrderSuccess';

import OrderList from './components/order/OrderList';
import OrderDetails from './components/order/OrderDetails';
import Dashboard from './components/admin/Dashboard';
import ProductList from './components/admin/ProductList';
import { default as AdminOrderList } from './components/admin/OrderList'; // Aliasing import using object destructuring
import NewProduct from './components/admin/NewProduct';
import UpdateProduct from './components/admin/UpdateProduct';
import UpdateOrder from './components/admin/UpdateOrder';
import UserList from './components/admin/UserList';
import UpdateUser from './components/admin/UpdateUser';
import ReviewList from './components/admin/ReviewList';

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []); // Ensure this effect runs only once after the component mounts

  return (
    <Router>
      <div className="App">
        <HelmetProvider>
          <Header />
          <div className='container container-fluid'>
            <ToastContainer theme='dark' position="bottom-center" />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search/:keyword" element={<ProductSearch />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/password/forgot" element={<ForgotPassword />} />
              <Route path="/password/reset/:token" element={<ResetPassword />} />
              <Route path="/myprofile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/myprofile/update" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
              <Route path="/myprofile/update/password" element={<ProtectedRoute><UpdatePassword /></ProtectedRoute>} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/shipping" element={<ProtectedRoute><Shipping /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
              <Route path="/myorders" element={<ProtectedRoute><OrderList /></ProtectedRoute>} />
              <Route exact path="/order/:id" element={<ProtectedRoute><OrderDetails/></ProtectedRoute>} />
            </Routes>
          </div>

          <Routes>
            <Route path="/admin/dashboard" element={<ProtectedRoute isAdmin={true}><Dashboard /></ProtectedRoute>} />
            <Route path="/admin/products" element={<ProtectedRoute isAdmin={true}><ProductList /></ProtectedRoute>} />
            <Route path="/admin/products/create" element={<ProtectedRoute isAdmin={true}><NewProduct /></ProtectedRoute>} />
            <Route path="/admin/products/:id" element={<ProtectedRoute isAdmin={true}><UpdateProduct /></ProtectedRoute>} />
            <Route path="/admin/order/:id" element={<ProtectedRoute isAdmin={true}><UpdateOrder /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute isAdmin={true}><AdminOrderList /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute isAdmin={true}><UserList /></ProtectedRoute>} />
            <Route path="/admin/user/:id" element={<ProtectedRoute isAdmin={true}><UpdateUser /></ProtectedRoute>} />
            <Route path="/admin/reviews" element={<ProtectedRoute isAdmin={true}><ReviewList /></ProtectedRoute>} />
          </Routes>
          <Footer />
        </HelmetProvider>
      </div>
    </Router>
  );
}

export default App;

