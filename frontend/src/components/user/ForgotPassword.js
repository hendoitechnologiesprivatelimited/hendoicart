import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, clearAuthError } from '../../actions/userActions';
import { toast } from 'react-toastify';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const { error, message } = useSelector(state => state.authState); // Corrected state.authState

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('email', email);

        dispatch(forgotPassword(formData));
    };

    useEffect(() => {
        if (message) {
            toast.success(message);
            setEmail('');
        }

        if (error) {
            toast.error(error, {
                onOpen: () => {
                    dispatch(clearAuthError());
                },
            });
        }
    }, [message, error, dispatch]);

    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form className="shadow-lg" onSubmit={handleSubmit}>
                    <h1 className="mb-3">Forgot Password</h1>
                    <div className="form-group">
                        <label htmlFor="email_field">Enter Email</label>
                        <input
                            type="email"
                            id="email_field"
                            className="form-control"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Enter your email"
                        />
                    </div>

                    <button
                        id="forgot_password_button"
                        type="submit"
                        className="btn btn-block py-3"
                    >
                        Send Email
                    </button>
                </form>
            </div>
        </div>
    );
}
