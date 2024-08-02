import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        loading: false,
        user: {},
        users: [],
        isUserUpdated: false,
        isUserDeleted: false,
        error: null,
    },
    reducers: {
        usersRequest(state) {
            state.loading = true;
            state.error = null;
        },
        usersSuccess(state, action) {
            state.loading = false;
            state.users = action.payload.users;
            state.error = null;
        },
        usersFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        userRequest(state) {
            state.loading = true;
            state.error = null;
        },
        userSuccess(state, action) {
            state.loading = false;
            state.user = action.payload.user;
            state.error = null;
        },
        userFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        deleteUserRequest(state) {
            state.loading = true;
            state.error = null;
        },
        deleteUserSuccess(state) {
            state.loading = false;
            state.isUserDeleted = true;
            state.error = null;
        },
        deleteUserFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        updateUserRequest(state) {
            state.loading = true;
            state.error = null;
        },
        updateUserSuccess(state) {
            state.loading = false;
            state.isUserUpdated = true;
            state.error = null;
        },
        updateUserFail(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        clearUserDeleted(state) {
            state.isUserDeleted = false;
        },
        clearUserUpdated(state) {
            state.isUserUpdated = false;
        },
        clearError(state) {
            state.error = null;
        },
    }
});

const { actions, reducer } = userSlice;
export const {
    usersRequest,
    usersSuccess,
    usersFail,
    userRequest,
    userSuccess,
    userFail,
    deleteUserRequest,
    deleteUserSuccess,
    deleteUserFail,
    updateUserRequest,
    updateUserSuccess,
    updateUserFail,
    clearUserDeleted,
    clearUserUpdated,
    clearError,
} = actions;
export default reducer;
