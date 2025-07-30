const mongoose = require('mongoose');

const CourseSchema = mongoose.Schema({
    courseTitle: {
        type: String,
    },
    orientationDay: {
        type: String,
    },
    courseLevel: {
        type: String,
    },

    courseDuration: {
        type: String,
    },

    totalCourseFee: {
        type: Number,
    },

    subject: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
    }],

    campus: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campus',
    }],

    language: {
        type: String,
    },
    backendWhatsappNumber: {
        type: String, // Use String to support different phone number formats
        
    },
    initialStudentNumber: {
        type: Number,
    
    },
    courseCode: {
        type: String,
       
    },

    /*classDay: {
        type: String,
    },
    sessionStartTime: {
        type: String,  // Store time as string (e.g., "09:00 AM")
    },
    sessionEndTime: {
        type: String,  // Store time as string (e.g., "10:30 AM")
    }*/

}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
