const express = require("express");

const {
  getproducts,
  newProduct,
  getsingleproduct,
  updateproduct,
  deleteproduct,
} = require("../controllers/productcontroller");
const router = express.Router();
const {
  isAutenticateduser,
  authorizeRoles,
} = require("../middlewares/autenticate");

// ...............................................................................

router.route("/products").get(isAutenticateduser, getproducts);
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
