const express = require("express");
const router = express.Router();
const zoom = require("../api/zoom");

router.get("/", (req, res) => res.send("Zoom API is working"));
router.post("/create", zoom.createMeeting);

module.exports = router;