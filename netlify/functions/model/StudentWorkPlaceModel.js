const mongoose = require('mongoose');

const StudentWorkPlaceSchema = mongoose.Schema({
    currentJobTitle: {
        type: String,
        required: true
    },

    companyName: {
        type: String,
        required: true
    },

    jobLocation: {
        type: String,
        required: true
    },

    jobType: {
        type: String,
        required: true
    },

    jobStartDate: {
        type: String,
        required: true
    },

});

const StudentWorkPlaceModel = mongoose.model('StudentWorkPlaceModel', StudentWorkPlaceSchema);

module.exports = StudentWorkPlaceModel;
