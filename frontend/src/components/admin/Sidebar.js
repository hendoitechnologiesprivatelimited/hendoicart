import React from 'react';
import { Link } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';


export default function Sidebar() {
    return (
        <div className="sidebar-wrapper">
            <nav id="sidebar">
                <ul className="list-unstyled components">
                <li>
    <Link to={'/admin/dashboard'}>
        <FontAwesomeIcon icon={faChartLine} /> Dashboard
    </Link>
</li>
                    <li>
                        <NavDropdown title={<i className='fa fa-product-hunt'>Product</i>}>
                            <NavDropdown.Item as={Link} to="/admin/products"><i className='fa fa-shopping-basket'>All</i></NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/admin/products/create"><i className='fa fa-plus'>Create</i></NavDropdown.Item>
                        </NavDropdown>
                    </li>
                    <li>
                        <Link to="/admin/orders"><i className="fa fa-shopping-basket"></i> Orders</Link>
                    </li>
                    <li>
                        <Link to="/admin/reviews"><i className="fa fa-shopping-basket"></i> Reviews</Link>
                    </li>
                    <li>
                        <Link to="/admin/users"><i className="fa fa-users"></i> Users</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

