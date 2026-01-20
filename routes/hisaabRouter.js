const express = require ("express");
const router = express.Router();
const {createHisaabController,
    hisaabpageController,
    readhisaabController,
    verifyhisaabController,
    readVerifiedhisaabController,
    deleteController,
    editController,
   
    updateHisaabController
} = require("../controllers/hisaabController");


const {
     isloggedin,
     redirectifloggedin 
 } = require("../middlewares/auth-middleware");

router.get("/create",isloggedin,hisaabpageController);
router.post("/create",isloggedin,createHisaabController);

router.get("/view/:id",isloggedin,readhisaabController);
router.post("/verify/:id",isloggedin,verifyhisaabController);
router.get("/:id",isloggedin,readVerifiedhisaabController);  



router.get("/delete/:id", deleteController);
router.get("/edit/:id",isloggedin,editController);
router.post("/edit/:id",isloggedin,updateHisaabController);



module.exports = router;