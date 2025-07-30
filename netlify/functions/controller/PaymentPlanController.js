const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const PaymentPlanModel = require('../model/PaymentPlanModel');
const CourseModel = require('../model/CourseModel');
const CampusModel = require('../model/CampusModel');
const {Types} = require("mongoose");
const mongoose = require("mongoose");

const secret = 'test';

const PaymentPlanController = {
    paymentPlanCreate: async (req, res) => {
        const { paymentTitle, courseTitle,campusName, paymentPlan, discount = 0, paymentAmount } = req.body;

        try {
            // Validate required fields
            if (!paymentTitle || !courseTitle || !paymentPlan || !paymentAmount) {
                return res.status(400).json({ message: "All fields except discount are required" });
            }

            // Check if the course exists
            const existingCourse = await CourseModel.findById(courseTitle);
            if (!existingCourse) {
                return res.status(404).json({ message: "Course does not exist" });
            }

            const totalCourseFee = existingCourse.totalCourseFee;

            // Calculate payment amount based on discount
            const calculatedPaymentAmount = discount > 0
                ? totalCourseFee - (totalCourseFee * (discount / 100))
                : totalCourseFee;

            // Create a new payment plan
            const newPaymentPlan = new PaymentPlanModel({
                paymentTitle,
                courseTitle,
                campusName,
                totalCourseFee,
                paymentPlan,
                disCount: discount, // Default discount to 0 if not provided
                paymentAmount: paymentAmount || calculatedPaymentAmount, // Use calculated payment amount if not provided
            });

            const result = await newPaymentPlan.save();
            res.status(201).json({ result });
            console.log("Payment Plan created successfully:", result);

        } catch (error) {
            console.error("Error creating payment plan:", error);
            res.status(500).json({ message: "Error creating payment plan", error: error.message });
        }
    },

    getAllPaymentPlans: async (req, res) => {
            try {
                // Fetch payment plans with populated courseTitle field from the Course model
                const paymentPlans = await PaymentPlanModel.find()
                    .populate('courseTitle', 'courseTitle totalCourseFee'); // Populate fields from the Course model

                res.status(200).json(paymentPlans);
            } catch (error) {
                // Log more detailed error for debugging
                console.error("Error fetching payment plans:", error);
                res.status(500).json({ message: "Error fetching payment plans", error: error.message });
            }
        },

    getPaymentPlanByCourse: async (req, res) => {
        const { courseId } = req.params;

       

        try {
            // Ensure courseId is a valid ObjectId
            if (!mongoose.Types.ObjectId.isValid(courseId)) {
                return res.status(400).json({ message: "Invalid course ID format" });
            }

            // Convert courseId to an ObjectId type
            const courseObjectId = mongoose.Types.ObjectId(courseId);

            // Query the PaymentPlan model by the courseTitle (which references the Course model)
            const paymentPlan = await PaymentPlanModel.findOne({ courseTitle: courseObjectId })
                .populate('courseTitle', 'courseTitle totalCourseFee'); // Populate course details

            if (!paymentPlan) {
                return res.status(404).json({ message: "No payment plan found for this course" });
            }

            res.status(200).json(paymentPlan);
        } catch (error) {
            console.error("Error fetching payment plan:", error);
            res.status(500).json({ message: "Error fetching payment plan", error: error.message });
        }
    },

    updatePaymentPlan: async (req, res) => {
        const { id } = req.params;
        const { paymentTitle, courseTitle, campusName, totalCourseFee, paymentPlan, discount = 0, paymentAmount } = req.body;

        try {
            // Validate required fields
            if (!paymentTitle || !courseTitle || !campusName || !totalCourseFee || !paymentPlan || !paymentAmount) {
                return res.status(400).json({ message: "All fields except discount are required" });
            }

            // Check if the course exists
            const existingCourse = await CourseModel.findById(courseTitle);
            if (!existingCourse) {
                return res.status(404).json({ message: "Course does not exist" });
            }

            // Ensure course fee matches
            if (existingCourse.totalCourseFee !== totalCourseFee) {
                return res.status(400).json({ message: "Course fee does not match the course's fee" });
            }

            // Validate that paymentPlan is a non-empty array
            if (!Array.isArray(paymentPlan) || paymentPlan.length === 0) {
                return res.status(400).json({ message: "Payment plan must be a non-empty array" });
            }

            // Recalculate paymentAmount if necessary
            const calculatedPaymentAmount = totalCourseFee - (totalCourseFee * (discount / 100));

            const updatedPaymentPlan = {
                paymentTitle,
                courseTitle,
                campusName,
                totalCourseFee,
                paymentPlan,
                disCount: discount,
                paymentAmount: paymentAmount || calculatedPaymentAmount,
            };

            // Update the payment plan
            const result = await PaymentPlanModel.findByIdAndUpdate(id, updatedPaymentPlan, { new: true });

            if (!result) {
                return res.status(404).json({ message: "Payment plan not found" });
            }

            res.status(200).json({ result });
            console.log("Payment Plan updated successfully:", result);

        } catch (error) {
            console.error("Error updating payment plan:", error);
            res.status(500).json({ message: "Error updating payment plan", error: error.message });
        }
    },
// Updated backend controller
getPaymentPlansByCampus: async (req, res) => {
    const { campusId } = req.params; // Renamed from campusName to be more accurate
    
    try {
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(campusId)) {
            return res.status(400).json({ 
                message: "Invalid campus ID format",
                receivedId: campusId
            });
        }

        // Find payment plans that reference this campus ID
        const paymentPlans = await PaymentPlanModel.find({ 
            campusName: new mongoose.Types.ObjectId(campusId) 
        })
        .populate("courseTitle", "courseTitle")
        .populate("campusName", "campusName");

        if (!paymentPlans || paymentPlans.length === 0) {
            return res.status(404).json({ 
                message: "No payment plans found for this campus",
                campusId: campusId
            });
        }

        res.status(200).json(paymentPlans);
    } catch (error) {
        console.error("Error in getPaymentPlansByCampus:", error);
        res.status(500).json({ 
            message: "Server error",
            error: error.message 
        });
    }
}
};

module.exports = PaymentPlanController;
