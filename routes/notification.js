const express = require('express');


const router = express.Router();

const notificationsController = require('../controllers/notificationController');
const isAuth = require("../middlewares/is-auth");

router.get("/notification", isAuth,  notificationsController.getNotification);
router.post("/aceptfriend", isAuth, notificationsController.postAceptFriend);
router.post("/denyfriend", isAuth, notificationsController.postDenyFriend);

module.exports = router;