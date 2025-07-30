const mongoose = require('mongoose');

const InstallmentSchema = mongoose.Schema({
  installmentNumber: {
    type: Number,
    
  },
  installmentAmount: {
    type: Number,
    
  },
  dueDate: {
    type: Date,
    
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending'], // Example: Paid or Pending
    default: 'Pending',
  },
});

const StudentPayInstallmentSchema = mongoose.Schema({
  StudentId: {
    type: String,
   
  },
  StudentName: {
    type: String,
   
  },
  Course: {
    type: String,
   
  },
  CourseFee: {
    type: Number,
    
  },
  Discount: {
    type: Number,
    default: 0, // Default discount is 0
  },
  PaymentPlan: {
    type: String,
  },
  PaymentAmount: {
    type: Number,
   
  },
  Installments: {
    type: [InstallmentSchema], // Array of installments
    default: [],
  },
});

const StudentPayInstallmentModel = mongoose.model(
  'StudentPayInstallment',
  StudentPayInstallmentSchema
);

module.exports = StudentPayInstallmentModel;
