const mongoose = require('mongoose');

const SuperAdminSchema = mongoose.Schema({
    superAdminId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    managedDirectors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Director' // Reference to the Academic Directors
    }],
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["Super Admin"],  // Restricting the role to "Super Admin"
        default: "Super Admin"
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const SuperAdmin = mongoose.model('SuperAdmin', SuperAdminSchema);

module.exports = SuperAdmin;
