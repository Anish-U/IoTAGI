var express = require('express');
var router = express.Router();
var Blog = require("../models/blog");
var middleware = require("../middleware");
router.get("/", function(req, res) {
    Blog.find({}, function(err, allBlogs) {
        if (err) {
            console.log(err);
        } else {
            res.render("blogs/blogs", { blogs: allBlogs, currentUser: req.user });
        }
    });
});
router.post("/", middleware.isLoggedIn, function(req, res) {
    var title = req.body.title;
    var desc = req.body.description;
    var image = req.body.image;
    var link = req.body.link;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newBlog = { title: title, description: desc, image: image, link: link, author: author };
    Blog.create(newBlog, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("/blogs");
        }
    });
});
router.get("/new", middleware.isLoggedIn, function(req, res) {

    res.render("blogs/new.ejs");

});
router.get("/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundBlog);
            res.render("blogs/show", { blog: foundBlog });
        }
    });
});
//EDIT ROUTE
router.get("/:id/edit", middleware.checkBlogOwnership, function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        res.render("blogs/edit", { blog: foundBlog });
    });
});
//UPDATE ROUTE
router.put("/:id", middleware.checkBlogOwnership, function(req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});
//DESTROY BLOGS ROUTE
router.delete("/:id", middleware.checkBlogOwnership, function(req, res) {
    Blog.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});
module.exports = router;