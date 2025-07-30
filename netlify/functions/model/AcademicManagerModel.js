const mongoose = require('mongoose');

const AcademicManagerSchema = mongoose.Schema({
    AcademicManagerId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    managedRoles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'  // Reference to the roles managed by this AcademicManager
    }],
    createdCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'  // Reference to the courses created by this AcademicManager
    }],
    campusName: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campus'  // Reference to the campuses associated with this AcademicManager
    }],

    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["AcademicManager"],  // Restricting the role to "Super Admin"
        default: "AcademicManager"
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const AcademicManager = mongoose.model('AcademicManager', AcademicManagerSchema);

module.exports = AcademicManager;
