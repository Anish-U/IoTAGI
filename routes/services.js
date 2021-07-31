var express = require('express');
var router = express.Router();
var Service = require("../models/service");
var middleware = require("../middleware");
router.get("/", function(req, res) {
    Service.find({}, function(err, allServices) {
        if (err) {
            console.log(err);
        } else {
            res.render("services/services", { services: allServices, currentUser: req.user });
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
    var newService = { name: name, description: desc, image: image, price: price, author: author };
    Service.create(newService, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/services");
        }
    });
});
router.get("/new", middleware.isLoggedIn, function(req, res) {

    res.render("services/new.ejs");

});
router.get("/:id", function(req, res) {
    Service.findById(req.params.id, function(err, foundService) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundService);
            res.render("services/show", { service: foundService });
        }
    });
});
//EDIT ROUTE
router.get("/:id/edit", middleware.checkServiceOwnership, function(req, res) {
    Service.findById(req.params.id, function(err, foundService) {
        res.render("services/edit", { service: foundService });
    });
});
//UPDATE ROUTE
router.put("/:id", middleware.checkServiceOwnership, function(req, res) {
    Service.findByIdAndUpdate(req.params.id, req.body.service, function(err, updatedService) {
        if (err) {
            res.redirect("/services");
        } else {
            res.redirect("/services/" + req.params.id);
        }
    });
});
//DESTROY ROUTE
router.delete("/:id", middleware.checkServiceOwnership, function(req, res) {
    Service.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/services");
        } else {
            res.redirect("/services");
        }
    });
});
module.exports = router;