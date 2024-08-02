const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const APIFeatures = require('../utils/apiFeatures');

// In productController.js
exports.getProducts = catchAsyncError(async (req, res, next) => {
    const resPerPage = 3;

    const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter();

    // Apply category filtering explicitly if category parameter is present
    if (req.query.category) {
        apiFeatures.query = apiFeatures.query.find({ category: req.query.category });
    }

    const filteredProductsCount = await apiFeatures.query.clone().countDocuments({});
    const totalProductsCount = await Product.countDocuments({});
    let productsCount = totalProductsCount;

    if (filteredProductsCount !== totalProductsCount) {
        productsCount = filteredProductsCount;
    }

    const products = await apiFeatures.paginate(resPerPage).query;

    res.status(200).json({
        success: true,
        count: productsCount,
        resPerPage,
        products,
    });
});


// Create new product
exports.newProduct = catchAsyncError(async (req, res, next) => {
    
      let images = []

      let BASE_URL = process.env.BACKEND_URL;
      if(process.env.NODE_ENV === "production") {
          BASE_URL = `${req.protocol}://${req.get('host')}`
      }

      if (req.files.length >0){
        req.files.forEach(file=> {
       
            let url = `${BASE_URL}/uploads/product/${file.originalname}`
            images.push({image: url})
        })
      }
    
    req.body.images = images;
    
    req.body.user = req.user.id;

    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product,
    });
});

// Get single product by ID
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('reviews.user','name email');

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        product,
    });
});

// Update product by ID
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);


    let images = []

    if (req.body.imagesCleared === 'false') {
        images = product.images;
    }

    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

      if (req.files.length >0){
        req.files.forEach(file=> {
       
            let url = `${BASE_URL}/uploads/product/${file.originalname}`
            images.push({image: url})
        })
      }
    
    req.body.images = images;

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        product,
    });
});

// Delete product by ID
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product Deleted",
    });
});

exports.createReview = catchAsyncError(async (req, res, next) => {
    const { productId, rating, comment } = req.body;

    const review = {
        user: req.user.id,
        rating,
        comment
    }

    const product = await Product.findById(productId);

    // Finding if the user review exists
    const isReviewed = product.reviews.find(review => review.user.toString() === req.user.id.toString());

    if (isReviewed) {
        // Updating the review
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user.id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        });
    } else {
        // Creating the review
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    // Calculating the average of product reviews
    product.ratings = product.reviews.reduce((acc, review) => review.rating + acc, 0) / product.reviews.length;
    product.ratings = isNaN(product.ratings) ? 0 : product.ratings;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true
    });
});

// Get Reviews - api/v1/reviews
exports.getReviews = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});

//delete reviews

exports.deleteReview = catchAsyncError (async (req, res, next) =>{
    const product = await Product.findById(req.query.productId);


    //filtering the review which does't match the deleting reviews id
    const reviews = product.reviews.filter(review=>{
        return review._id.toString() !==  req.query.id.toString()
    });

    // number of reviews 
    const numOfReviews = reviews.length;

    //finding the average  with the filtered reviews
    let ratings = reviews.reduce((acc,review)=>{
        return review.rating + acc;

    }, 0)/ reviews.length;
    ratings = isNaN(ratings)?0:ratings;

    //save the product document
    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        numOfReviews,
        ratings
    })

    res.status(200).json({
        success: true
    })
})

// get admin products  -   api/v1/admin/products

exports.getAdminProducts = catchAsyncError (async (req, res, next)=>{
    const products = await Product.find();
    res.status(200).send({
        success:true,
        products
    })
})
