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
  req.body.user = req.user.id;
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

// create Review
// {{base_url}}/api/v1/review

exports.createReview = catchAsyncError(async (req, res, next) => {
  const { productId, rating, comment } = req.body;

  const review = {
    user: req.user.id,
    rating: rating,
    comment,
  };
  const product = await Product.findById(productId);

  // finding user already revied
  const isReviewed = product.reviews.find((review) => {
    return review.user.toString() == req.user.id.toString();
  });

  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review.user.toString() == req.user.id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });

    // adding new review
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  // find the average of the product reviews
  product.ratings =
    product.reviews.reduce((acc, review) => {
      return review.rating + acc;
    }, 0) / product.reviews.length;
  // incase the review 0 it will show NAN for that
  product.ratings = isNaN(product.ratings) ? 0 : product.ratings;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get Reviews
// {{base_url}}/api/v1/reviews

exports.getReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review

exports.deletReview = catchAsyncError(async (req, res, next) => {
  // finding (productId)
  const product = await Product.findById(req.query.productId);

  // filtering the rewiers which does not match the deleting review id
  const reviews = product.reviews.filter((review) => {
    return review._id.toString() !== req.query.id.toString();
  });
  //  number of reviews
  const numOfReviews = reviews.length;

  // finding the averge with the filterd reviews
  let ratings =
    reviews.reduce((acc, review) => {
      return review.rating + acc;
    }, 0) / reviews.length;

  // incase the review 0 it will show
  ratings = isNaN(ratings) ? 0 : ratings;

  // saving the product document
  await Product.findByIdAndUpdate(req.query.productId, {
    reviews,
    numOfReviews,
    ratings,
  });

  res.status(200).json({
    success: true,
  });
});
