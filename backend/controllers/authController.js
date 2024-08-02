const catchAsyncError = require('../middlewares/catchAsyncError');
const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwt');
const sendEmail = require('../utils/email');
const crypto = require('crypto');
const path = require('path');

// Register user
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;
    let avatar;

    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    if (req.file) {
        avatar = `${BAE_URL}/uploads/user/${req.file.originalname}`;
    }

    const user = await User.create({
        name,
        email,
        password,
        avatar
    });

    sendToken(user, 201, res);
});

// Login user
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    const isPasswordValid = await user.isValidPassword(password);

    if (!isPasswordValid) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    sendToken(user, 200, res);
});

// Logout user
exports.logoutUser = (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};

// Forgot password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404));
    }

    const resetToken = user.getResetToken();
    await user.save({ validateBeforeSave: false });

    let BASE_URL = process.env.FRONTEND_URL;
    if(process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    const resetUrl = `${BASE_URL}/password/reset/${resetToken}`;

    const message = `Your password reset URL is as follows:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset',
            message
        });

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(error.message, 500));
    }
});

// Reset password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    console.log('Reset password route hit');
    console.log('Token:', req.params.token);
    console.log('New password:', req.body.password);

    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or has expired', 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});

// Get user profile
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    });
});

// Change password
exports.changePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    if (!await user.isValidPassword(req.body.oldPassword)) {
        return next(new ErrorHandler('Old Password is incorrect', 401));
    }

    user.password = req.body.password;
    await user.save();
    res.status(200).json({
        success: true
    });
});

// Update profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    };

     let avatar;
    let BASE_URL = process.env.BACKEND_URL;
    if(process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    if (req.file) {
        newUserData.avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        user
    });
});

// Get all users
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    });
});

// Get user by ID
exports.getUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User not found with this id ${req.params.id}`));
    }
    res.status(200).json({
        success: true,
        user
    });
});

// Update user
exports.updateUser = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    };

    if (req.file) {
        newUserData.avatar = `${process.env.BACKEND_URL}/uploads/user/${req.file.originalname}`;
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        user
    });
});

// Delete user
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User not found with this id ${req.params.id}`));
    }

    await user.deleteOne();

    res.status(200).json({
        success: true
    });
});
