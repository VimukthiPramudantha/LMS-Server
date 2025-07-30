const mongoose = require('mongoose');

const CampusSchema = mongoose.Schema({
    campusName: {
        type: String,
    },

   /* course: [{  // Corrected field name
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'  // Reference to the subjects offered by this campus
    }],*/

    manageFiled: {
        type: String,
    },
    mktdepartment: {
        type: String,
    },
    mktdivision: {
        type: String,
    },
    projectNo: {
        type: String,
    },
    
    createdByDirector: {
        type: String,
    },

}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

const Campus = mongoose.model('Campus', CampusSchema);

module.exports = Campus;
