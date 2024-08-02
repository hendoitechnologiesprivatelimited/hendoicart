import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  useParams } from 'react-router-dom';
import { getUser, updateUser } from '../../actions/userActions';
import { clearError, clearUserUpdated } from '../../slices/userSlice';
import { toast } from 'react-toastify';

export default function UpdateUser() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const { id: userId } = useParams();

  const { loading, isUserUpdated, error, user } = useSelector(state => state.userState);
  const { user:authUser } = useSelector (state =>state.authState)
 
 
  const dispatch = useDispatch();

  

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('role', role);
    
    dispatch(updateUser(userId, formData));
  };

    useEffect(() => {
    if (isUserUpdated) {
      toast('User updated Successfully!', {
        type: 'success',
        onOpen: () => dispatch(clearUserUpdated())
      });
   
      return;
    }

    if (error) {
      toast(error, {
        type: 'error',
        onOpen: () => { dispatch(clearError()); }
      });
      return;
    }
    dispatch(getUser(userId));
  }, [isUserUpdated, error, dispatch, userId]);

  useEffect(() => {
    if (user._id) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
     
          }
  }, [user]);

  return (
    <div className="wrapper my-5">
      <form className="shadow-lg" encType="multipart/form-data" onSubmit={submitHandler}>
        <h1 className="mb-4">Update User</h1>

        <div className="form-group">
          <label htmlFor="name_field">Name</label>
          <input
            type="text"
            id="name_field"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="price_field">Email</label>
          <input
            type="text"
            id="price_field"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

       
        <div className="form-group">
          <label htmlFor="category_field">Role</label>
          <select
            disabled={user._id === authUser._id}
            className="form-control"
            id="category_field"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
         
            <option value='admin'>Admin</option>
            <option value='user'>User</option>
            
          </select>
        </div>

       
        <button id="login_button" type="submit" disabled={loading} className="btn btn-block py-3">
          UPDATE
        </button>
      </form>
    </div>
  );
}

