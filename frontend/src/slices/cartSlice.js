import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [],
        loading: false,
        shippingInfo: localStorage.getItem('shippingInfo') ? JSON.parse(localStorage.getItem('shippingInfo')) : {}
    },
    reducers: {
        addCartItemRequest(state) {
            state.loading = true;
        },
        addCartItemSuccess(state, action) {
            const item = action.payload;
            const isItemExist = state.items.find(i => i.product === item.product);

            if (isItemExist) {
                state.loading = false;
            } else {
                state.items.push(item);
                state.loading = false;
                localStorage.setItem('cartItems', JSON.stringify(state.items));
            }
        },
        increaseCartItemQty(state, action) {
            state.items = state.items.map(item => {
                if (item.product === action.payload) {
                    item.quantity = item.quantity + 1;
                }
                return item;
            });
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },
        decreaseCartItemQty(state, action) {
            state.items = state.items.map(item => {
                if (item.product === action.payload) {
                    item.quantity = item.quantity - 1;
                }
                return item;
            });
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },
        removeItemFromCart(state, action) {
            const filterItems = state.items.filter(item => item.product !== action.payload);
            localStorage.setItem('cartItems', JSON.stringify(filterItems));
            return {
                ...state,
                items: filterItems
            };
        },
        clearCart(state) {
            state.items = [];
            localStorage.removeItem('cartItems');
        },
        saveShippingInfo(state, action) {
            localStorage.setItem('shippingInfo', JSON.stringify(action.payload));
            return {
                ...state,
                shippingInfo: action.payload
            };
        }
    }
});

const { actions, reducer } = cartSlice;
export const {
    addCartItemRequest,
    addCartItemSuccess,
    increaseCartItemQty,
    decreaseCartItemQty,
    removeItemFromCart,
    clearCart, // Exporting clearCart action
    saveShippingInfo
} = actions;
export default reducer;
