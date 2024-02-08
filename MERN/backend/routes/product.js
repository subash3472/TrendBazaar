const express = require("express");

const {
  getproducts,
  newProduct,
  getsingleproduct,
  updateproduct,
  deleteproduct,
  createReview,
  getReviews,
  deletReview,
} = require("../controllers/productcontroller");
const router = express.Router();
const {
  isAutenticateduser,
  authorizeRoles,
} = require("../middlewares/autenticate");

// ...............................................................................

router.route("/products").get(isAutenticateduser, getproducts);
// reviews

router.route("/review").put(isAutenticateduser, createReview);
router.route("/reviews").get(isAutenticateduser, getReviews);
// router.route("/review").delete(isAutenticateduser, deletReview);
router.route("/review").delete(deletReview);

// ..........................
// admin routes
router
  .route("admin/product/new")
  .post(isAutenticateduser, authorizeRoles("admin"), newProduct);

router
  .route("/product/:id")
  .get(getsingleproduct)
  .put(updateproduct)
  .delete(deleteproduct);

module.exports = router;
