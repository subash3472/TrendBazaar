const express = require("express");
const {
  newOrder,
  getsingleOrder,
  myOrders,
  orders,
  updateOrder,
  deleteOrder,
} = require("../controllers/ordercontroller");
const {
  isAutenticateduser,
  authorizeRoles,
} = require("../middlewares/autenticate");
// const { deleteUser } = require("../controllers/authcontrollers");
const router = express.Router();

router.route("/order/new").post(isAutenticateduser, newOrder);
router.route("/order/:id").get(isAutenticateduser, getsingleOrder);
router.route("/myorders").get(isAutenticateduser, myOrders);

// admin routes

router
  .route("/admin/orders")
  .get(isAutenticateduser, authorizeRoles("admin"), orders);

router
  .route("/admin/order/:id")
  .put(isAutenticateduser, authorizeRoles("admin"), updateOrder);

router
  .route("/admin/order/:id")
  .delete(isAutenticateduser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
