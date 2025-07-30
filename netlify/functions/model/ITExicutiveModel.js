const mongoose = require('mongoose');

const ITExecutiveSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    ITExecutiveIsDirector: {
        type: Boolean,
        default: false
    },

    password: {
        type: String,
        required: true
    },

    ITExecutiveID:{
        type: String,
    },

    role: {
        type: String,
        enum: ["ITExecutive"],
        default: "ITExecutive"
    }

}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const ITExecutive = mongoose.model('ITExecutive', ITExecutiveSchema);

module.exports = ITExecutive;