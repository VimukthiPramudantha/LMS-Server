const mongoose = require('mongoose');

const PaymentPlanSchema = mongoose.Schema({
    paymentTitle:{
        type: String,
        required: true
    },

    courseTitle:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    },
    campusName:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campus',
    },

    totalCourseFee:{
        type: Number,
    },

    paymentPlan:[{
        installmentNumber:{
            type: Number,
        },

        installmentAmount:{
            type: Number,
        },

        dueDate:{
            type: String,
        },

        paymentStatus:{
            type: String,
        }
    }],

    disCount:{
        type: Number,
    },

    paymentAmount:{
        type: Number,
    }
}, { timestamps: true });  // Automatically add createdAt and updatedAt fields

const PaymentPlan = mongoose.model('PaymentPlan', PaymentPlanSchema);

module.exports = PaymentPlan;
