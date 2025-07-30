const mongoose = require("mongoose");

const StudentEducationDetailSchema = mongoose.Schema({
  education: {
    universityInstitution: {
      type: String,
      //   required: true
    },
    degreeDiploma: {
      type: String,
      // required: true
    },
    fieldOfStudy: {
      type: String,
      // required: true
    },
    startDate: {
      type: String,
      // required: true
    },
    endDate: {
      type: String,
      // required: true
    },
  },
});

const StudentEducationDetail = mongoose.model(
  "StudentEducationDetail",
  StudentEducationDetailSchema
);
module.exports = StudentEducationDetail;
