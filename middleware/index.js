var Blog = require("../models/blog");
var Product = require("../models/product");
var Service = require("../models/service");
var Faq = require("../models/faq");
var middlewareObj = {};

middlewareObj.checkBlogOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Blog.findById(req.params.id, function (err, foundBlog) {
      if (err) {
        req.flash("error", "Blog not found");
        res.redirect("back");
      } else {
        if (foundBlog.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You dont have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in");
    res.redirect("back");
  }
};
middlewareObj.checkProductOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Product.findById(req.params.id, function (err, foundProduct) {
      if (err) {
        req.flash("error", "Product not found");
        res.redirect("back");
      } else {
        if (foundProduct.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You dont have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in");
    res.redirect("back");
  }
};
middlewareObj.checkServiceOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Service.findById(req.params.id, function (err, foundService) {
      if (err) {
        req.flash("error", "Service not found");
        res.redirect("back");
      } else {
        if (foundService.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You dont have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in");
    res.redirect("back");
  }
};
middlewareObj.checkFaqOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Faq.findById(req.params.id, function (err, foundFaq) {
      if (err) {
        req.flash("error", "Faq not found");
        res.redirect("back");
      } else {
        if (foundFaq.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You dont have permission to do that");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You need to be logged in");
    res.redirect("back");
  }
};
middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "Please login first");
  res.redirect("/login");
};
module.exports = middlewareObj;
