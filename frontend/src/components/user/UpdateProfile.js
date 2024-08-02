import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, clearAuthError } from '../../actions/userActions';
import { toast } from 'react-toastify';
import { clearUpdateProfile } from '../../slices/authSlice';

export default function UpdateProfile() {
    const dispatch = useDispatch();
    const { error, user, isUpdated } = useSelector(state => state.authState);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');

    // Ignore 'loading' warning
    // eslint-disable-next-line
    // const [loading, setLoading] = useState(false); // Uncomment this if 'loading' is to be used

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setAvatarPreview(user.avatar); // Directly set avatar URL
        }
    }, [user]);

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            setAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result); // Set avatar preview from file reader
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        if (avatar) {
            formData.append('avatar', avatar);
        }
        
        dispatch(updateProfile(formData));
    };

    useEffect(() => {
        if (isUpdated) {
            toast('Profile updated Successfully', {
                type: 'success',
                onOpen: ()=> dispatch(clearUpdateProfile())
            });
        }

        if (error) {
            toast.error(error, {
                onOpen: () => {
                    dispatch(clearAuthError());
                },
            });
        }
        // Include 'dispatch' in the dependency array
    }, [isUpdated, error, dispatch]);

    return (
        <div className="row wrapper">
            <div className="col-10 col-lg-5">
                <form className="shadow-lg" onSubmit={handleSubmit} encType="multipart/form-data">
                    <h1 className="mt-2 mb-5">Update Profile</h1>

                    <div className="form-group">
                        <label htmlFor="name_field">Name</label>
                        <input
                            type="text"
                            id="name_field"
                            className="form-control"
                            name="name"
                            value={name}
                            onChange={handleNameChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email_field">Email</label>
                        <input
                            type="email"
                            id="email_field"
                            className="form-control"
                            name="email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="avatar_upload">Avatar</label>
                        <div className="d-flex align-items-center">
                            <div>
                                <figure className="avatar mr-3 item-rtl">
                                    <img
                                        src={avatarPreview || user.avatar}
                                        className="rounded-circle"
                                        alt="Avatar Preview"
                                    />
                                </figure>
                            </div>
                            <div className="custom-file">
                                <input
                                    type="file"
                                    name="avatar"
                                    className="custom-file-input"
                                    id="customFile"
                                    onChange={handleAvatarChange}
                                />
                                <label className="custom-file-label" htmlFor="customFile">
                                    Choose Avatar
                                </label>
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn update-btn btn-block mt-4 mb-3">
                        Update
                    </button>
                </form>
            </div>
        </div>
    );
}
