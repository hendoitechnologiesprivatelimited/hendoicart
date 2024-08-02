const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Product Name"],
    trim: true,
    maxLength: [100, "Product name cannot exceed 100 characters"]
  },
  price: {
    type: Number,
    required: true,
    default: 0.0
  },
  description: {
    type: String,
    required: [true, "Please enter Product Description"]
  },
  ratings: {
    type: Number,
    default: 0
  },
  images: [{
    image: {
      type: String,
      required: true
    }
  }],
  category: {
    type: String,
    required: [true, "Please enter Product Category"],
    enum: {
      values: [
        'Electronics',
        'Mobile Phones',
        'Laptops',
        'Accessories',
        'Headphones',
        'Food',
        'Books',
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoor',
        'Home'
      ],
      message: "Please select a correct category"
    }
  },
  seller: {
    type: String,
    required: [true, "Please enter Product Seller"]
  },
  stock: {
    type: Number,
    required: [true, "Please enter Product Stock"],
    
  },
  numOfReviews: {
    type: Number,
    default: 0
  },
  reviews: [
    {
      user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        required: true
      },
      comment: {
        type: String,
        required: true
      }
    }
  ],
  user: {
    type:mongoose.Schema.Types.ObjectId
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

let schema = mongoose.model('Product', productSchema);
module.exports = schema;
