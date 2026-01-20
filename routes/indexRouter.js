const express = require ("express");
const router = express.Router();

const upload = require('../config/multer-config');

const {homepageController ,
     registerpageController,
     registerController,
     loginController,
     logoutController,
     profileController

} = require("../controllers/indexController");
const { isloggedin,
     redirectifloggedin 
 } = require("../middlewares/auth-middleware");


router.get("/",redirectifloggedin ,homepageController);
router.get("/register",registerpageController);
router.get("/logout",logoutController);
router.get("/profile",isloggedin,profileController);


router.post("/register", upload.single('image'),registerController);
router.post("/login",loginController);


module.exports = router;