import { addCartItemRequest, addCartItemSuccess } from "../slices/cartSlice";
import axios from 'axios';

export const addCartItem = (id, quantity) => async (dispatch) => {
    try {
        dispatch(addCartItemRequest());
        const { data } = await axios.get(`/api/v1/product/${id}`);
        
        // Log the API response to verify the structure
        console.log('API Response:', data);

        dispatch(addCartItemSuccess({
    product: data.product._id,
    name: data.product.name,
    price: data.product.price,
    image: data.product.images[0].image, // Ensure you are accessing the correct property
    stock: data.product.stock,
    quantity
}));

    } catch (error) {
        console.error('Failed to add item to cart:', error);
    }
};
