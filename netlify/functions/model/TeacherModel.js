// filepath: /path/to/your/backend/models/teacherModel.js
const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  teacherId: {
    type: String,
   //  required: true,
   //  unique: true
  },
  password: {
    type: String,
   //  required: true
  },
  name: {
    type: String,
  //  required: true
  },
  role: {
   type: String,
  //  required: true
  },
  referenceNo: {
    type: String,
   //  required: true
  },
  contactNo: {
    type: String,
   //  required: true
  },
  email: {
    type: String,
   //  required: true,
   //  unique: true
  },   
   role: {
    type: String,
    enum: ["Teacher"],
    default: "Teacher"
}
},{timestamps: true});


const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;