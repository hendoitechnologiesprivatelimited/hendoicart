import React, { useEffect, useState } from 'react';
import { resetPassword, clearAuthError } from '../../actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useDispatch();
    const { isAuthenticated, error, message } = useSelector(state => state.authState);
    const navigate = useNavigate();
    const { token } = useParams();

    const handleSubmit = (e) => {
        e.preventDefault();
    
        const formData = {
            password: password,
            confirmPassword: confirmPassword
        };
    
        console.log('FormData being sent:', formData); // Log the data for debugging
    
        dispatch(resetPassword(formData, token));
    };
    
    useEffect(() => {
        console.log('isAuthenticated:', isAuthenticated);
        console.log('message:', message);
        console.log('error:', error);
        
        if (isAuthenticated) {
            toast.success('Password Reset Success!');
            navigate('/');
            return;
        }
    
        if (message) {
            toast.success(message);
        }
    
        if (error) {
            toast.error(error, {
                onOpen: () => {
                    dispatch(clearAuthError());
                },
            });
        }
    }, [isAuthenticated, message, error, dispatch, navigate]);
    

    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form className="shadow-lg" onSubmit={handleSubmit}>
                    <h1 className="mb-3">New Password</h1>

                    <div className="form-group">
                        <label htmlFor="password_field">Password</label>
                        <input
                            type="password"
                            id="password_field"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm_password_field">Confirm Password</label>
                        <input
                            type="password"
                            id="confirm_password_field"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        id="new_password_button"
                        type="submit"
                        className="btn btn-block py-3">
                        Set Password
                    </button>
                </form>
            </div>
        </div>
    );
}
