const express = require('express');


const router = express.Router();

const friendsController = require('../controllers/FriendsController');
const isAuth = require("../middlewares/is-auth");

router.get("/friends", isAuth,  friendsController.getFriends);
router.post('/addfriend',isAuth, friendsController.postAddFriend);
router.get('/foundfriend',isAuth, friendsController.getfoundFriend);
router.post('/foundfriend',isAuth, friendsController.getfoundedFriend);
router.post('/deletefriend',isAuth, friendsController.postDeleteFriend);
router.post("/friends-comentaries", isAuth, friendsController.PostComentarie);
router.post("/friends-replys", isAuth, friendsController.PostReply);

module.exports = router;