const app = require("./app");

const dotenv = require("dotenv");
const path = require("path");
const connectDatabase = require("./config/database");

dotenv.config({ path: path.join(__dirname, "config/config.env") });

// im calling here
connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(
    `server listining to the post >> ${process.env.PORT} <<in >>${process.env.NODE_ENV}<<`
  );
});
// if got any issues on db connection string , db will cutof but severwill kepp on running , this for handle that
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("shutting down the servwe due to undhandled rection error");
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("shutting down the servwe due to uncaughtException error");
  server.close(() => {
    process.exit(1);
  });
});
