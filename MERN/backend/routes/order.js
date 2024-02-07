const express = require("express");
const {
  newOrder,
  getsingleOrder,
  myOrders,
  orders,
} = require("../controllers/ordercontroller");
const {
  isAutenticateduser,
  authorizeRoles,
} = require("../middlewares/autenticate");
const router = express.Router();

router.route("/order/new").post(isAutenticateduser, newOrder);
router.route("/order/:id").get(isAutenticateduser, getsingleOrder);
router.route("/myorders").get(isAutenticateduser, myOrders);

// admin routes

router
  .route("/orders")
  .get(isAutenticateduser, authorizeRoles("admin"), orders);

module.exports = router;
