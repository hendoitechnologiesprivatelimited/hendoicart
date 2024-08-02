const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
    registerUser, loginUser, logoutUser, forgotPassword, resetPassword,
    getUserProfile, changePassword, updateProfile,
    getAllUsers, getUser, updateUser, deleteUser
} = require('../controllers/authController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');

const uploadDir = path.join(__dirname, '..', 'uploads', 'user');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

const router = express.Router();

router.route('/register').post(upload.single('avatar'), registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').post(resetPassword);
router.route('/myprofile').get(isAuthenticatedUser, getUserProfile);
router.route('/password/change').put(isAuthenticatedUser, changePassword);
router.route('/update').put(isAuthenticatedUser, upload.single('avatar'), updateProfile);

router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);
router.route('/admin/user/:id')
    .get(isAuthenticatedUser, authorizeRoles('admin'), getUser)
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateUser)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);

module.exports = router;
