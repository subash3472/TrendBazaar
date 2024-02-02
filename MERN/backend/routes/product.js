const express = require("express");

const {
  getproducts,
  newProduct,
  getsingleproduct,
  updateproduct,
  deleteproduct,
} = require("../controllers/productcontroller");
const router = express.Router();
const { isAutenticateduser } = require("../middlewares/autenticate");

// ...............................................................................

router.route("/products").get(isAutenticateduser, getproducts);
router.route("/product/new").post(newProduct);

// router.route("/product/:id").get(getsingleproduct);
// router.route("/product/:id").put(updateproduct);
// router.route("/product/:id").delete(deleteproduct);
router
  .route("/product/:id")
  .get(getsingleproduct)
  .put(updateproduct)
  .delete(deleteproduct);

module.exports = router;
