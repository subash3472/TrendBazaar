const catchAsyncError = require("../middlewares/catchasyncerror");
const Product = require("../models/productmodel");
const Order = require("../models/ordermodel");
const ErrorHandler = require("../utils/errorhandler");

// create new order - {{base_url}}/api/v1/order/new
exports.newOrder = catchAsyncError(async (req, res, next) => {
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

exports.getsingleOrder = catchAsyncError(async (req, res, next) => {
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

exports.myOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// Admin: Get All users Orders
// {{base_url}}/api/v1/orders

exports.orders = catchAsyncError(async (req, res, next) => {
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

// Admin: update order or order status

exports.updateOrder = catchAsyncError(async (req, res, next) => {
  //orderer id getting form req
  const order = await Order.findById(req.params.id);
  if (order.orderStatus == "Delivered") {
    return next(new ErrorHandler("order has been already Delivered!"), 400);
  }

  //updating the product stock of each item
  order.orderItems.forEach(async (orderItem) => {
    await updatestock(orderItem.product, orderItem.quantity);
  });

  // Update order status and deliveredAt
  order.orderStatus = req.body.orderStatus;
  order.deliveredAt = Date.now();
  await order.save();

  res.status(200).json({
    success: true,
  });
});

async function updatestock(productId, quantity) {
  // product id
  const product = await Product.findById(productId);
  product.stock = product.stock - quantity;
  product.save({ validateBeforeSave: false });
}

// Admin: Delete order - api/v1/order/:id
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorHandler(`Order not found with this id: ${req.params.id}`, 404)
    );
  }
  await order.deleteOne();
  res.status(200).json({
    success: true,
  });
});
