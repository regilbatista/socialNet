const express = require('express');


const router = express.Router();

const homeController = require('../controllers/publicationController');
const isAuth = require("../middlewares/is-auth");

router.get("/", isAuth,  homeController.gethome);
router.post("/", isAuth, homeController.PostHome);
router.get("/edit-publications/:publiId", isAuth, homeController.getEditPublication);
router.post("/edit-publications", isAuth, homeController.postEditPublication);
router.post("/drop-publication", isAuth, homeController.postDeletePublication);
router.post("/comentaries", isAuth, homeController.PostComentarie);
router.post("/replys", isAuth, homeController.PostReply);

module.exports = router;