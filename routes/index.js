const tweetsController = require("../controllers/tweetsController.js");
const adminController = require("../controllers/adminController.js");
const userController = require("../controllers/userController.js");
module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/signin");
  };
  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) {
        return next();
      }
      return res.redirect("/");
    }
    res.redirect("/signin");
  };
  // 記得這邊要接收 passport
  // 如果使用者訪問首頁，就導向 /tweets 的頁面
  app.get("/", authenticated, (req, res) => res.redirect("tweets"));
  app.get("/tweets", authenticated, tweetsController.getTweets);

  // 連到 /admin 頁面就轉到 /admin/tweets
  app.get("/admin", authenticated, (req, res) =>
    res.redirect("/admin/tweets")
  );
  app.get("/admin/tweets", authenticated, adminController.getTweets);

  app.get("/signup", userController.signUpPage);
  app.post("/signup", userController.signUp);

  app.get("/signin", userController.signInPage);
  app.post(
    "/signin",
    passport.authenticate("local", {
      failureRedirect: "/signin",
      failureFlash: true
    }),
    userController.signIn
  );
  app.get("/logout", userController.logout);
};