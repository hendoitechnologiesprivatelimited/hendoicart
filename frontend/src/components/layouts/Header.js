import React from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../actions/userActions';
import { Link } from 'react-router-dom';
import Search from './Search'; // Adjust the path according to your project structure
import { Dropdown, Image } from 'react-bootstrap';



export default function Header() {
  const { isAuthenticated, user } = useSelector(state => state.authState);
  const { items: cartItems } = useSelector (state => state.cartState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
      dispatch(logout());
  };

  return (
      <nav className="navbar row">
          <div className="col-12 col-md-3">
              <div className="navbar-brand">
                  <Link to="/">
                      <img width="150px" src="/images/amazonlogo.png" alt="Logo" />
                  </Link>
              </div>
          </div>

          <div className="col-12 col-md-6 mt-2 mt-md-0">
              <Search />
          </div>

          <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
              {isAuthenticated && user ? (
                  <Dropdown className='d-inline'>
                      <Dropdown.Toggle variant='default text-white pr-5' id='dropdown-basic'>
                          <figure className='avatar avatar-nav'>
                              {user.avatar ? (
                                  <Image width='50px' src={user.avatar} alt="User Avatar" />
                              ) : (
                                  <Image width='50px' src='./images/default_avatar.png' alt="Default Avatar" />
                              )}
                          </figure>
                          <span>{user.name}</span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                          {user.role === 'admin' && <Dropdown.Item className='text-dark' onClick={()=>{navigate('/admin/dashboard')}}> Dashboard </Dropdown.Item>}
                          <Dropdown.Item className='text-dark' onClick={()=>{navigate('/myprofile')}}> Profile </Dropdown.Item>
                          <Dropdown.Item className='text-dark' onClick={()=>{navigate('/myorders')}}> My Orders </Dropdown.Item>
                          <Dropdown.Item className='text-danger' onClick={logoutHandler}> Logout </Dropdown.Item>
                      </Dropdown.Menu>
                  </Dropdown>
              ) : (
                  <Link to='/login' className="btn" id="login_btn">Login</Link>
              )}
              <Link  to='/cart'><span id="cart" className="ml-3">Cart</span> </Link>
              <span className="ml-1" id="cart_count">{cartItems.length}</span>
          </div>
      </nav>
  );
}
