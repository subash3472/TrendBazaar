const Product = require("../models/productmodel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncError = require("../middlewares/catchasyncerror");
const APIFeatures = require("../utils/apiFeatures");

// ...........................................................
// get all products = /api/v1/product/
exports.getproducts = async (req, res, next) => {
  const resultperpage = 2;
  const aoifeatures = new APIFeatures(Product.find(), req.query)
    .search()
    .filter()
    .paginate(resultperpage);

  const products = await aoifeatures.querry;
  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
};
// ..........................................................
// create product - /api/v1/product/new
exports.newProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
    // product : produce = product (contation valuve & key )
  });
});

// .............................................................

// get single product
exports.getsingleproduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 400));
  }

  res.status(201).json({
    success: true,
    product,
  });
};
// ..............................................................
// Update product -api/v1/product/:id
exports.updateproduct = async (req, res, next) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "product not found",
    });
  }
  // before updating im calling new updated datas , im running validators for validation
  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    product,
  });
};

// ....................................................................

// delete product = api/v1/product/:id
exports.deleteproduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "product not found",
    });
  }
  const deletedProduct = await product.deleteOne();
  if (deletedProduct.deletedCount === 1) {
    return res.status(200).json({
      success: true,
      message: "product deleted!",
    });
  }
};
