const mongoose = require('mongoose');

const SubjectSchema = mongoose.Schema({
    subjectId: {
        type: String,
        unique: true
    },
    subjectName: {
        type: String,
    },
    lectureName: {
        type: String,
    },
    classDay: {
        type: String,
    },
    sessionStartTime: {
        type: String,  // Store time as string (e.g., "09:00 AM")
    },
    sessionEndTime: {
        type: String,  // Store time as string (e.g., "10:30 AM")
    },
    zoomId: {
        type: String,  // Add this field to store Zoom meeting ID
    },
    zoomPassword: {
        type: String,  // Add this field to store Zoom meeting password
    },
    classLink: {
        type: String,  // Add this field to store Zoom class link
    },
    status: {
        type: Boolean,  // Add this field for active/inactive status
        default: true,
    }
}, { timestamps: true });  // Automatically add createdAt and updatedAt fields

const Subject = mongoose.model('Subject', SubjectSchema);

module.exports = Subject;

