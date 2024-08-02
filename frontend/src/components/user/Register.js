import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearAuthError } from '../../actions/userActions';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [avatar, setAvatar] = useState(null); // Initialize avatar state as null
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.png');

    const { loading, error, isAuthenticated } = useSelector(state => state.authState);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }

        if (error) {
            toast.error(error, {
                onOpen: () => {
                    dispatch(clearAuthError());
                }
            });
        }
    }, [error, dispatch, isAuthenticated, navigate]);

    const onChange = e => {
        if (e.target.name === 'avatar') {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(e.target.files[0]); // Store the file object in state
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setUserData({ ...userData, [e.target.name]: e.target.value });
        }
    };

    const submitHandler = e => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', userData.name);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        formData.append('avatar', avatar); // Append the avatar file object

        dispatch(register(formData));
    };

    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form onSubmit={submitHandler} className="shadow-lg" encType="multipart/form-data">
                    <h1 className="mb-3">Register</h1>

                    <div className="form-group">
                        <label htmlFor="name_field">Name</label>
                        <input
                            name="name"
                            onChange={onChange}
                            type="text"
                            id="name_field"
                            className="form-control"
                            value={userData.name}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email_field">Email</label>
                        <input
                            type="email"
                            id="email_field"
                            name="email"
                            onChange={onChange}
                            className="form-control"
                            value={userData.email}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password_field">Password</label>
                        <input
                            type="password"
                            id="password_field"
                            name="password"
                            onChange={onChange}
                            className="form-control"
                            value={userData.password}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="avatar_upload">Avatar</label>
                        <div className="d-flex align-items-center">
                            <div>
                                <figure className="avatar mr-3 item-rtl">
                                    <img src={avatarPreview} className="rounded-circle" alt="Avatar" />
                                </figure>
                            </div>
                            <div className="custom-file">
                                <input
                                    type="file"
                                    name="avatar"
                                    className="custom-file-input"
                                    id="customFile"
                                    onChange={onChange}
                                />
                                <label className="custom-file-label" htmlFor="customFile">
                                    Choose Avatar
                                </label>
                            </div>
                        </div>
                    </div>

                    <button
                        id="register_button"
                        type="submit"
                        className="btn btn-block py-3"
                        disabled={loading}
                    >
                        REGISTER
                    </button>
                </form>
            </div>
        </div>
    );
}
