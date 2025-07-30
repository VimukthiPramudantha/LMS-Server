const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  start_time: { type: String, required: true },
  duration: { type: Number, required: true },
  meeting_id: { type: String, required: true },
  join_url: { type: String, required: true },
});

module.exports = mongoose.model("Meeting", meetingSchema);
