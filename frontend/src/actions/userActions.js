import axios from 'axios';
import { 
    loginRequest, loginSuccess, loginFail, clearError, 
    registerRequest, registerSuccess, registerFail, 
    loadUserRequest, loadUserSuccess, loadUserFail, 
    logoutSuccess, logoutFail,
    updateProfileRequest,
    updateProfileSuccess,
    updateProfileFail,
    updatePasswordRequest,
    updatePasswordSuccess,
    updatePasswordFail,
    forgotPasswordRequest,
    forgotPasswordSuccess,
    forgotPasswordFail,
    resetPasswordRequest,
    resetPasswordSuccess,
    resetPasswordFail
} from "../slices/authSlice";

import { usersRequest, usersSuccess, usersFail, userRequest, userSuccess, userFail, deleteUserRequest, deleteUserSuccess, deleteUserFail, updateUserRequest, updateUserSuccess, updateUserFail} from '../slices/userSlice'


const handleError = (error, dispatch, failAction) => {
    const message = error.response ? error.response.data.message : error.message;
    dispatch(failAction(message));
};

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch(loginRequest());
        const { data } = await axios.post('/api/v1/login', { email, password });
        dispatch(loginSuccess(data));
    } catch (error) {
        handleError(error, dispatch, loginFail);
    }
};

export const clearAuthError = () => (dispatch) => {
    dispatch(clearError());
};

export const register = (userData) => async (dispatch) => {
    try {
        dispatch(registerRequest());
        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        };
        const { data } = await axios.post('/api/v1/register', userData, config);
        dispatch(registerSuccess(data));
    } catch (error) {
        handleError(error, dispatch, registerFail);
    }
};

export const loadUser = () => async (dispatch) => {
    try {
        dispatch(loadUserRequest());
        const { data } = await axios.get('/api/v1/myprofile');
        dispatch(loadUserSuccess(data));
    } catch (error) {
        handleError(error, dispatch, loadUserFail);
    }
};

export const logout = () => async (dispatch) => {
    try {
        dispatch(clearAuthError()); // Clear any previous errors
        const { data } = await axios.get('/api/v1/logout');
        if (data.success) {
            dispatch(logoutSuccess());
        } else {
            dispatch(logoutFail('Logout failed'));
        }
    } catch (error) {
        handleError(error, dispatch, logoutFail);
    }
};

export const updateProfile = (userData) => async (dispatch) => {
    try {
        dispatch(updateProfileRequest());
        const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
        };
        const { data } = await axios.put('/api/v1/update', userData, config);
        dispatch(updateProfileSuccess(data));
    } catch (error) {
        handleError(error, dispatch, updateProfileFail);
    }
};

export const updatePassword = (formData) => async (dispatch) => {
    try {
        dispatch(updatePasswordRequest());
        const config = {
            headers: { 'Content-Type': 'application/json' }
        };
        await axios.put('/api/v1/password/change', formData, config);
        dispatch(updatePasswordSuccess());
    } catch (error) {
        handleError(error, dispatch, updatePasswordFail);
    }
};

export const forgotPassword = (formData) => async (dispatch) => {
    try {
        dispatch(forgotPasswordRequest());
        const config = {
            headers: { 'Content-Type': 'application/json' }
        };
        const { data } = await axios.post('/api/v1/password/forgot', formData, config);
        dispatch(forgotPasswordSuccess(data));
    } catch (error) {
        handleError(error, dispatch, forgotPasswordFail);
    }
};

export const resetPassword = (formData, token) => async (dispatch) => {
    try {
        dispatch(resetPasswordRequest());
        const response = await fetch(`/api/v1/password/reset/${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const data = await response.json();

        if (response.ok) {
            dispatch(resetPasswordSuccess(data.user)); // Update with appropriate user data from backend
        } else {
            dispatch(resetPasswordFail(data.message));
        }
    } catch (error) {
        dispatch(resetPasswordFail('Password reset failed. Please try again.'));
    }
};

export const getUsers = () => async (dispatch) => {
    try {
        dispatch(usersRequest());
        const { data } = await axios.get('/api/v1/admin/users');
        dispatch(usersSuccess(data));
    } catch (error) {
        dispatch(usersFail(error.response.data.message));
    }
};

export const getUser = id => async (dispatch) => {
    try {
        dispatch(userRequest());
        const { data } = await axios.get(`/api/v1/admin/user/${id}`);
        dispatch(userSuccess(data));
    } catch (error) {
        dispatch(userFail(error.response.data.message));
    }
};

export const deleteUser = id => async (dispatch) => {
    try {
        dispatch(deleteUserRequest());
         await axios.delete(`/api/v1/admin/user/${id}`);
        dispatch(deleteUserSuccess());
    } catch (error) {
        dispatch(deleteUserFail(error.response.data.message));
    }
};

export const updateUser = (id, formData) => async (dispatch) => {
    try {
        dispatch(updateUserRequest());
        const config = {
            headers: { 'Content-Type': 'application/json' }
        };
        await axios.put(`/api/v1/admin/user/${id}`, formData, config);
        dispatch(updateUserSuccess());
    } catch (error) {
        dispatch(updateUserFail(error.response.data.message));
    }
};
