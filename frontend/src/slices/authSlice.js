import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        loading: true,
        isAuthenticated: false,
        user: null,
        error: null
    },
    reducers: {
        loginRequest(state) {
            state.loading = true;
        },
        loginSuccess(state, action) {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        loginFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        clearError(state) {
            state.error = null;
        },
        registerRequest(state) {
            state.loading = true;
        },
        registerSuccess(state, action) {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        registerFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        loadUserRequest(state) {
            state.loading = true;
            state.isAuthenticated = false;
        },
        loadUserSuccess(state, action) {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
        },
        loadUserFail(state, action) {
            state.loading = false;
            
        },
        logoutSuccess(state) {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
        },
        logoutFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        updateProfileRequest(state) {
            state.loading = true;
            state.isUpdated = false;
        },
        updateProfileSuccess(state, action) {
            state.loading = false;
            state.isUpdated = true;
            state.user = action.payload.user;
        },
        updateProfileFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        clearUpdateProfile(state, action) {
            state.isUpdated = false;
            
        },
        updatePasswordRequest(state) {
            state.loading = true;
            state.isUpdated = false;
        },
        updatePasswordSuccess(state, action) {
            state.loading = false;
            state.isUpdated = true;
            
        },
        updatePasswordFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },

        
        forgotPasswordRequest(state) {
            state.loading = true;
            state.message = null;
            
        },
        forgotPasswordSuccess(state, action) {
            state.loading = false;
            state.message = action.payload.message;

            
        },
        forgotPasswordFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        resetPasswordRequest(state) {
            state.loading = true;
            
        },
        resetPasswordSuccess(state, action) {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user; // Make sure action.payload.user contains the updated user object
        },
        
        
        resetPasswordFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const { 
    loginRequest, 
    loginSuccess, 
    loginFail, 
    clearError, 
    registerRequest, 
    registerSuccess, 
    registerFail, 
    loadUserRequest, 
    loadUserSuccess, 
    loadUserFail,
    logoutSuccess,
    logoutFail,
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
    resetPasswordFail,
    clearUpdateProfile
} = authSlice.actions;

export default authSlice.reducer;
