const products = require("../data/product.json");
const product = require("../models/productmodel");
const dotenv = require("dotenv");
const connectDatabase = require("../config/database");

// seerder, there have some list of products ..i need to show for client , for that
// if lot products means cant do from postman of direct insert to database not possible ,
// list of datas in product.jon life , im directly inject all of them to database
// to auto inject ("seeder": "node backend/utils/seeder.js") to run (PS D:\TrendBazaar\MERN> npm run seeder)

dotenv.config({ path: "backend/config/config.env" });
connectDatabase();

const seedProducts = async () => {
  try {
    await product.deleteMany();
    console.log("All product deleted in database");
    await product.insertMany(products);
    console.log("All product added in database!!");
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
  //   after injected to db it will exit
};
seedProducts();
