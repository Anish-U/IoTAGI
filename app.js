var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user");
var methodOverride = require("method-override");
var blogRoutes = require("./routes/blogs");
var productRoutes = require("./routes/products");
var serviceRoutes = require("./routes/services");
var faqRoutes = require("./routes/faqs");

//add faq, newsletter routes once the schema is final like blog, product and service as shown
var indexRoutes = require("./routes/index");
mongoose.connect("mongodb://localhost/iotagi", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");
app.use(
  require("express-session")({
    secret: "hello world",
    resave: false,
    saveUninitialized: false,
  })
);
passport.use(new LocalStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
app.use("/", indexRoutes);
app.use("/blogs", blogRoutes);
app.use("/products", productRoutes);
app.use("/services", serviceRoutes);
app.use("/faqs", faqRoutes);
app.listen(3006, function () {
  console.log("App about to start");
});
