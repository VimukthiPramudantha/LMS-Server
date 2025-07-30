const mongoose = require("mongoose");

const InstallmentSchema = mongoose.Schema({
// To this:
coordinateAddStudentIns: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'CoordinateAddStudent', // matches your model name
},

  installmentNumber: {
    type: Number,
  },
  installmentAmount: {
    type: Number,
  },
  dueDate: {
    type: String,
  },
  //ddd
  PaidAmount: {
    type: String,
  },
  Remaining: {
    type: String,
  },
  PaidDate: {
    type: String,
  },
  OfficerName: {
    type: String,
  },
  accApproval: {
    type: String,
    enum: ["Pending","No","Yes"],
    default: "Pending"
  },
  accHeadApproval: {
    type: String,
    enum: ["Pending","No","Yes"],
    default: "Pending"
  },

  paymentSlipReference: {
    type: String,
  },
  paymentSlipReferenceCheck: {
    type: String,
  },


  paymentStatus: {
    type: String,
    enum: ["No Paid", "Paid", "Pending", "Checking"], // Example: Paid or Pending
    default: "Pending",
  },
});

const PaymentHistorySchema = mongoose.Schema({
  
// To this:
coordinateAddStudentPay: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'CoordinateAddStudent', // matches your model name
},
installmentNumber: {
  type: String,
},
  PaymentHistoryNumber: {
    type: Number,
  },
  PaymentHistoryPaidAmount: {
    type: String,
  },
  PaymentHistoryPaidDate: {
    type: String,
  },
  PayHisSlipReference: {
    type: String,
  },
  PayHisOfficerName: {
    type: String,
  },
  payHisAccApproval: {
    type: String,
    enum: ["Pending","No","Yes"],
    default: "No"
  },
  payHisAccHeadApproval: {
    type: String,
    enum: ["Pending","No","Yes"],
    default: "Pending"
  },
  paymentSlipRef: {
    type: String,
  },
  payHisSlipRefCheck: {
    type: String,
  },
  PayHisPaymentStatus: {
    type: String,
    enum: ["No Paid", "Paid", "Pending", "Checking"], // Example: Paid or Pending
    default: "Pending",
  },
});
// In your Mongoose schema
PaymentHistorySchema.index({ PayHisSlipReference: 1 }, { unique: true });

const CoordinateAddStudentSchema = mongoose.Schema({
  // CoordinateAddStudentSchema fields
  campusName: {
    type: String, // Store campus name as a string
  },
  courseTitle: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  paymentPlan: {
    type: String, // Store payment plan as a string
  },
  studentID: {
    type: String,
    unique: true, // Ensures no duplication
  },
  studentName: {
    type: String,
  },
  studentNIC: {
    type: String,
  },
  childhoodNIC: {
    type: String,
  },
  password: {
    type: String,
  },
  whatsAppMobileNo1: {
    type: String,
    unique: true, // Ensures no duplication
  },
  profileImage: {
    type: String, // Storing Base64 encoded string
    required: false,
    validate: {
      validator: function(v) {
        if (!v) return true; // Optional field
        return v.startsWith('data:image');
      },
      message: props => `Invalid image format! Must be base64 encoded image`
    }
  },
  disCount: {
    type: Number,
  },
  paymentAmount: {
    type: Number,
  },
  paidAmount: {
    type: Number,
  },
  firstDuePayment: {
    type: Number,
  },
  portalAccess: {
    type: Boolean,
    default: false
},

  // StudentDetails as an object
  studentDetails: {
    fullName: {
      type: String,
    },
    fullNameCertificate: {
      type: String,
    },
    addressNICStudent: {
      type: String,
    },
    AddressPostStudent: {
      type: String,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    whatsAppMobileNo2: {
      type: String,
    },
  },

  // StudentEducationDetail as an object
  // school details
  addSchoolDetails: {
    schoolName: {
      type: String,
    },
    startGrade: {
      type: String,
    },
    startYear: {
      type: String,
    },
    endGrade: {
      type: String,
    },
    endYear: {
      type: String,
    },
  },

  // universityInstitution details
  addUniversityInstitution: {
    universityInstitutionName: {
      type: String,
    },
    courseName: {
      type: String,
    },
    courseLevel: {
      type: String,
    },
    startYear: {
      type: String,
    },
    endYear: {
      type: String,
    },
  },

  // StudentWorkPlace as an object
  workPlaceDetails: {
    companyName: {
      type: String,
    },
    jobPosition: {
      type: String,
    },
    jobLocation: {
      type: String,
    },
    jobStartDate: {
      type: String,
    },
  },
  // Array of installments
  Installments: {
    type: [InstallmentSchema],
    default: [],
  },

  // Array of PaymentHistory
  PaymentHistory: {
    type: [PaymentHistorySchema],
    default: [],
  },
});
CoordinateAddStudentSchema.set("timestamps", true);
const CoordinateAddStudent = mongoose.model(
  "CoordinateAddStudent",
  CoordinateAddStudentSchema
);

module.exports = CoordinateAddStudent;
