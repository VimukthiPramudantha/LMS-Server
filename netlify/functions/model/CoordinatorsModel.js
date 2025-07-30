const mongoose = require('mongoose');

const CoordinatorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Ensures no duplication
    },

    assignCampus:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campus',
    }],

    coordinatorIsDirector: {
        type: Boolean,
        default: false
    },

    password: {
        type: String,
        required: true
    },

    coordID:{
        type: String,
    },

    role: {
        type: String,
        enum: ["Coordinator"],
        default: "Coordinator"
    }


}, {
    timestamps: true //// Automatically adds createdAt and updatedAt fields
});

const Coordinator = mongoose.model('Coordinator', CoordinatorSchema);

module.exports = Coordinator;
