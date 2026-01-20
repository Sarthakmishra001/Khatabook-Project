const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports.isloggedin = async function(req, res, next) {
  try {
    if (!req.cookies.token) {
      console.log("❌ no token");
      return res.redirect("/");
    }

    let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);

    let user = await userModel.findById(decoded.id);

    if (!user) {
      console.log("❌ token valid but user not found");
      res.cookie("token", "");
      return res.redirect("/");
    }

    req.user = user;
    console.log("✅ user authenticated:", user.email);
    return next();

  } catch (err) {
    console.log("🔥 auth error:", err.message);
    res.cookie("token", "");
    return res.redirect("/");
  }
};

module.exports.redirectifloggedin = async function(req, res, next) {
  try {
    if (!req.cookies.token) return next();

    let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
    let user = await userModel.findById(decoded.id);

    if (user) {
      console.log("➡️ already logged in, redirect profile");
      return res.redirect("/profile");
    } else {
      res.cookie("token", "");
      return next();
    }

  } catch (err) {
    res.cookie("token", "");
    return next();
  }
};
