const mongoose = require("mongoose");
const dbgr = require("debug")("development:mongoose");
const config = require("config");

// mongoose
//   .connect(`${config.get("MONGODB_URL")}`)
//   .then(function () {
//     dbgr("Connected To MongoB");
//   })
//   .catch(function () {
//     dbgr("Error Connecting To MongoB");
//   });

mongoose
  .connect(`${config.get("MONGODB_URL")}`)
  .then(() => console.log("Connected To Database!"))
  .catch(() => console.log("Error Connecting To Database!"));

module.exports = mongoose.connection;
