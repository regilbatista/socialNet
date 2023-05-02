const express = require('express');

const router = express.Router();

const loginController = require('../controllers/LoginController');
const isAuth = require("../middlewares/is-auth");


router.get("/signup", loginController.getSignup);
router.post("/signup",  loginController.PostSignup);
router.get("/login" , loginController.getLogin);
router.post("/login", loginController.PostLogin);
router.get("/logout", isAuth ,loginController.getLogout);
router.get("/forgot", loginController.getForgot);
router.post("/forgot", loginController.posForgot);
router.get("/active/:userId", loginController.getActive);


module.exports = router;