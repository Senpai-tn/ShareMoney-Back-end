var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var locationsRouter = require("./routes/locations");
var adminRouter = require("./routes/admin");
var publicationRouter = require("./routes/publications");
require("dotenv").config();
var jwt = require("jsonwebtoken");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/user", express.static(path.join(__dirname, "uploads")));

mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("connected")
);
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/locations", locationsRouter);
app.use("/admin", adminRouter);
app.use("/publications", publicationRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
app.post("/test", (req, res) => {
  console.log(req.body);
  res.send(req.body);
});
app.listen(3000, "0.0.0.0");
module.exports = app;
