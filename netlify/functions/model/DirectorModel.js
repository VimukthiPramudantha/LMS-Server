const mongoose = require('mongoose');

const AcademicDirectorSchema = mongoose.Schema({
    directorId: {
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
        ref: 'Role'  // Reference to the roles managed by this director
    }],
    createdCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'  // Reference to the courses created by this director
    }],
    campusName: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campus'  // Reference to the campuses associated with this director
    }],

    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["Director"],  // Restricting the role to "Super Admin"
        default: "Director"
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Director = mongoose.model('Director', AcademicDirectorSchema);

module.exports = Director;
