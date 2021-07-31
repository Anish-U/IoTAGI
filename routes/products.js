var express = require('express');
var router = express.Router();
var Product = require("../models/product");
var middleware = require("../middleware");
router.get("/", function(req, res) {
    Product.find({}, function(err, allProducts) {
        if (err) {
            console.log(err);
        } else {
            res.render("products/products", { products: allProducts, currentUser: req.user });
        }
    });
});
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var desc = req.body.description;
    var image = req.body.image;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newProduct = { name: name, description: desc, image: image, price: price, author: author };
    Product.create(newProduct, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/products");
        }
    });
});
router.get("/new", middleware.isLoggedIn, function(req, res) {

    res.render("products/new.ejs");

});
router.get("/:id", function(req, res) {
    Product.findById(req.params.id, function(err, foundProduct) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundProduct);
            res.render("products/show", { product: foundProduct });
        }
    });
});
//EDIT ROUTE
router.get("/:id/edit", middleware.checkProductOwnership, function(req, res) {
    Product.findById(req.params.id, function(err, foundProduct) {
        res.render("products/edit", { product: foundProduct });
    });
});
//UPDATE ROUTE
router.put("/:id", middleware.checkProductOwnership, function(req, res) {
    Product.findByIdAndUpdate(req.params.id, req.body.product, function(err, updatedProduct) {
        if (err) {
            res.redirect("/products");
        } else {
            res.redirect("/products/" + req.params.id);
        }
    });
});
//DESTROY ROUTE
router.delete("/:id", middleware.checkProductOwnership, function(req, res) {
    Product.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/products");
        } else {
            res.redirect("/products");
        }
    });
});
module.exports = router;