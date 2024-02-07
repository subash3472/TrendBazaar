// this file is giving routes for users

const express = require("express");
const {
  registerUser,
  loginUser,
  logoutuser,
  getUsersprofile,
  changepassword,
  updateProfile,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/authcontrollers");

const {
  isAutenticateduser,
  authorizeRoles,
} = require("../middlewares/autenticate");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutuser);
router.route("/myprofile").get(isAutenticateduser, getUsersprofile);
router.route("/password/change").put(isAutenticateduser, changepassword);
router.route("/update").put(isAutenticateduser, updateProfile);

// admin routes
router
  .route("/admin/users")
  .get(isAutenticateduser, authorizeRoles("admin"), getAllUsers);

router
  .route("/admin/user/:id")
  .get(isAutenticateduser, authorizeRoles("admin"), getUser)
  .put(isAutenticateduser, authorizeRoles("admin"), updateUser)
  .delete(isAutenticateduser, authorizeRoles("admin"), deleteUser);

module.exports = router;
