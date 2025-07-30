const jwt = require("jsonwebtoken");
const StudentPayInstallmentModel = require("../model/StudentPayInstallmentModel");

const secret = "test";

const StudentPayInstallmentController = {
  addStudentPayInstallent: async (req, res) => {
    try {
      const {
        StudentId,
        StudentName,
        Course,
        CourseFee,
        Discount,
        PaymentPlan,
        PaymentAmount,
        paymentStatus,
        Installments,
      } = req.body;

      if (!StudentId || !StudentName || !Course || !Installments || !PaymentAmount) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (!Array.isArray(Installments) || Installments.length === 0) {
        return res
          .status(400)
          .json({ message: "Installments must be an array and cannot be empty" });
      }
      const NewStudentPayInstallment = new StudentPayInstallmentModel({
         StudentId: req.body.StudentId,
         StudentName: req.body.StudentName,
         Course: req.body.Course,
         CourseFee: req.body.CourseFee,
         Discount: req.body.Discount,
         PaymentPlan: req.body.PaymentPlan,
         PaymentAmount: req.body.PaymentAmount,
         Installments: req.body.Installments, // Pass an array of installment objects
       });

      const result = await NewStudentPayInstallment.save();

      const token = jwt.sign(
        {
          id: result._id,
          StudentId,
          StudentName,
          Course,
          CourseFee,
          Discount,
          PaymentPlan,
          PaymentAmount,
          Installments,
        },
        secret,
        { expiresIn: "3h" }
      );

      res.status(201).json({ result, token });
    } catch (error) {
      console.error("Error occurred while creating student installment:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  },

  getAllCampuses: async (req, res) => {
    try {
      const campuses = await StudentPayInstallmentModel.find();
      res.status(200).json(campuses);
    } catch (error) {
      res.status(500).json({ message: "Error fetching campuses" });
    }
  },
};

module.exports = StudentPayInstallmentController;
