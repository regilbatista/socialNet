const express = require('express');
const router = express.Router();

const eventsController = require('../controllers/eventsController');
const isAuth = require("../middlewares/is-auth");

router.get("/events", isAuth,  eventsController.getEvents);
router.get("/add-events", isAuth,  eventsController.getAddEvent);
router.post("/add-events", isAuth,  eventsController.postAddEvent);
router.post("/drop-event", isAuth, eventsController.postDeleteEvent);
router.get("/add-guests/:eventId", isAuth, eventsController.getAddGuests);
router.post("/add-guests", isAuth,  eventsController.postAddGuests);
router.get("/view-guests/:eventId", isAuth, eventsController.getViewGuests);
router.post("/drop-guests", isAuth, eventsController.postDeleteGuests);
router.post("/guests-response", isAuth, eventsController.postResponseGuests);
module.exports = router;