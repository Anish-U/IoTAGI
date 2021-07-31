var express = require("express");
var router = express.Router();
var Faq = require("../models/faq");
var middleware = require("../middleware");

router.get("/", function (req, res) {
  Faq.find({}, function (err, allFaqs) {
    if (err) {
      console.log(err);
    } else {
      res.render("faqs/faqs", {
        faqs: allFaqs,
        currentUser: req.user,
      });
    }
  });
});

router.post("/", middleware.isLoggedIn, function (req, res) {
  var question = req.body.question;
  var answer = req.body.answer;
  var author = {
    id: req.user._id,
    username: req.user.username,
  };
  var newFaq = {
    question: question,
    answer: answer,
    author: author,
  };
  Faq.create(newFaq, function (err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      console.log(newlyCreated);
      res.redirect("/faqs");
    }
  });
});

router.get("/new", middleware.isLoggedIn, function (req, res) {
  res.render("faqs/new.ejs");
});

//EDIT ROUTE
router.get("/:id/edit", middleware.checkFaqOwnership, function (req, res) {
  Faq.findById(req.params.id, function (err, foundFaq) {
    res.render("faqs/edit", { faq: foundFaq });
  });
});

//UPDATE ROUTE
router.put("/:id", middleware.checkFaqOwnership, function (req, res) {
  Faq.findByIdAndUpdate(
    req.params.id,
    req.body.faq,
    function (err, updatedFaq) {
      res.redirect("/faqs");
    }
  );
});

//DESTROY ROUTE
router.delete("/:id", middleware.checkFaqOwnership, function (req, res) {
  Faq.findByIdAndRemove(req.params.id, function (err) {
    res.redirect("/faqs");
  });
});

module.exports = router;
