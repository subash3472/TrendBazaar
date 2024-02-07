const catchasyncerror = require("../middlewares/catchasyncerror");
const Order = require("../models/ordermodel");
const ErrorHandler = require("../utils/errorhandler");

// create new order - {{base_url}}/api/v1/order/new
exports.newOrder = catchasyncerror(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user.id,
  });
  res.status(200).json({
    success: true,
    order,
  });
});

// git single order
// {{base_url}}/api/v1/order/65c307261fd2d91a980ce7be

// populate() is used to find db

exports.getsingleOrder = catchasyncerror(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!order) {
    return next(
      new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    success: true,
    order,
  });
});

// get Loggedin user orders
// {{base_url}}/api/v1/myorders

exports.myOrders = catchasyncerror(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// Admin: Get All users Orders -

exports.orders = catchasyncerror(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});
