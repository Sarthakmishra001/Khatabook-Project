const userModel = require("../models/user-model");
const hisaabModel = require("../models/hisaab");

module.exports.createHisaabController = async function(req, res) {
  let { title, description, encrypted, shareable, passcode, editpermissions } = req.body;

  encrypted = encrypted === "on" ? true : false;
  shareable = shareable === "on" ? true : false;
  editpermissions = editpermissions === "on" ? true : false;

  try {
    let hisaabcreated = await hisaabModel.create({
      title,
      description,
      encrypted,
      shareable,
      passcode,
      editpermissions,
      user: req.user._id
    });

    let user = await userModel.findById(req.user.id);
    user.hisaabs.push(hisaabcreated._id);
    await user.save();

    return res.redirect("/profile");

  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message);
  }
};

module.exports.hisaabpageController = async function(req, res) {
  return res.render("create");
};

module.exports.readhisaabController = async function(req, res) {
  let hisaab = await hisaabModel.findOne({ _id: req.params.id }).populate("user");

  if (!hisaab) return res.status(404).send("Hisaab not found");

  if (hisaab.encrypted) {
    return res.render("passcode", { hisaab });
  } else {
    return res.render("hisaab", { hisaab });
  }
};

module.exports.verifyhisaabController = async function(req, res) {
  let hisaab = await hisaabModel.findOne({ _id: req.params.id }).populate("user");

  if (!hisaab) return res.status(404).send("Hisaab not found");

  if (hisaab.passcode == req.body.passcode) {
    return res.redirect(`/hisaab/${req.params.id}`);
  } else {
    return res.status(401).send("Invalid passcode");
  }
};

module.exports.readVerifiedhisaabController = async function(req, res) {
  let hisaab = await hisaabModel.findOne({ _id: req.params.id }).populate("user");

  if (!hisaab) return res.status(404).send("Hisaab not found");

  return res.render("hisaab", { hisaab });
};

module.exports.deleteController = async function(req, res) {
  try {
    await hisaabModel.findOneAndDelete({ _id: req.params.id });
    return res.redirect("/profile");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Delete failed");
  }
};

module.exports.editController = async function(req, res) {
  let update = await hisaabModel.findOne({ _id: req.params.id });

  if (!update) return res.status(404).send("Hisaab not found");

  return res.render("edit", { update });
};

module.exports.updateHisaabController = async function(req, res) {
  let { id } = req.params;
  let { title, description, shareable, passcode, editpermissions } = req.body;

  shareable = shareable === "on" ? true : false;
  editpermissions = editpermissions === "on" ? true : false;

  try {
    let updatedHisaab = await hisaabModel.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { title, description, shareable, passcode, editpermissions },
      { new: true }
    );

    if (!updatedHisaab) {
      return res.status(404).send("Hisaab not found");
    }

    return res.redirect("/profile");

  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message);
  }
};
