const userModel = require('../models/user-model');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

module.exports.homepageController = function(req, res) {
  return res.render("index", { loggedin: false });
};

module.exports.registerpageController = function(req, res) {
  return res.render("register", { loggedin: false });
};

module.exports.registerController = async function(req, res) {
  let { name, username, email, password } = req.body;

  try {
    let user = await userModel.findOne({ email });
    if (user) return res.send("You already have an account, please login");

    let salt = await bcrypt.genSalt(10);
    let hashed = await bcrypt.hash(password, salt);

    let imageUrl = '';
    if (req.file) {
      imageUrl = req.file.buffer.toString('base64');
    }

    user = await userModel.create({
      name,
      username,
      email,
      password: hashed,
      image: imageUrl
    });

    let token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_KEY
    );

    res.cookie("token", token);
    return res.redirect("/profile");

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).send("Register error");
  }
};

module.exports.loginController = async function(req, res) {
  let { email, password } = req.body;

  try {
    let user = await userModel.findOne({ email }).select("+password");
    if (!user) return res.send("user not found");

    let result = await bcrypt.compare(password, user.password);
    if (!result) return res.send("incorrect password");

    let token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_KEY
    );

    res.cookie("token", token);
    return res.redirect("/profile");

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).send("Login error");
  }
};

module.exports.logoutController = function(req, res) {
  res.cookie("token", "");
  return res.redirect("/");
};

/* 🔥🔥🔥 THIS WAS YOUR REAL BUG ZONE 🔥🔥🔥 */
module.exports.profileController = async function(req, res) {
  try {
    console.log("🔥 profile route hit");

    if (!req.user) {
      console.log("❌ req.user missing");
      return res.redirect("/");
    }

    let byDate = Number(req.query.byDate) || -1;
    let { startDate, endDate } = req.query;

    startDate = startDate ? new Date(startDate) : new Date("1970-01-01");
    endDate = endDate ? new Date(endDate) : new Date();

    console.log("🔍 finding user:", req.user.email);

    let user = await userModel.findOne({ email: req.user.email })
      .populate({
        path: "hisaabs",
        match: { createdAt: { $gte: startDate, $lte: endDate } },
        options: { sort: { createdAt: byDate } }
      });

    if (!user) {
      console.log("❌ user not found in DB");
      return res.redirect("/");
    }

    console.log("✅ profile loaded");
    return res.render("profile", { user });

  } catch (err) {
    console.error("🔥 PROFILE CRASH:", err);
    return res.status(500).send("Profile load error");
  }
};
