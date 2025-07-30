const mongoose = require('mongoose');

const StudentDetailsSchema = new mongoose.Schema({
  // StudentDetails as an object
  studentId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CoordinateAddStudent',
    unique: true,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  fullNameCertificate: {
    type: String,
    required: true,
  },
  addressStudent: {
    type: String,
    required: true,
  },
  postAddressStudent: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
  },
  whatsAppMobileNo1: {
    type: String,
    unique: true,
    required: true,
  },
  whatsAppMobileNo2: {
    type: String,
  },

  // StudentEducationDetail as an object
  // school details
  addSchoolDetails: {
    schoolName: {
      type: String,
      required: true,
    },
    startGrade: {
      type: String,
      required: true,
    },
    startYear: {
      type: String,
      required: true,
    },
    endGrade: {
      type: String,
      required: true,
    },
    endYear: {
      type: String,
      required: true,
    },
  },

  // universityInstitution details
  addUniversityInstitution: {
    universityInstitutionName: {
      type: String,
      required: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    courseLevel: {
      type: String,
      required: true,
    },
    startYear: {
      type: String,
      required: true,
    },
    endYear: {
      type: String,
      required: true,
    },
  },

  // StudentWorkPlace as an object
  workPlaceDetails: {
    companyName: {
      type: String,
      required: true,
    },
    jobPosition: {
      type: String,
      required: true,
    },
    jobLocation: {
      type: String,
      required: true,
    },
    jobStartDate: {
      type: Date,
      required: true,
    },
  },
});

const StudentDetails = mongoose.model("StudentDetails", StudentDetailsSchema);
module.exports = StudentDetails;