const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = "test";
const CoordinateAddStudentModel = require("../model/CoordinateAddStudentModel");
const mongoose = require("mongoose");

const CoordinatorAddStudentController = {
  // Get student by id
  getStudent: async (req, res) => {
    const { id } = req.params;
    try {
      // Find student by id
      const student = await CoordinateAddStudentModel.findById(id);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.status(200).json(student);
    } catch (error) {
      console.error("Error fetching student:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  addStudent: async (req, res) => {
    try {
        // Destructure required fields from request body
        const {
            campusName,
            courseTitle,
            paymentPlan,
            studentID,
            studentName,
            StudentNIC,
            childHoodNIC,
            password,
            disCount = 0, // Default value
            paymentAmount,
            paidAmount = 0, // Default value
            firstDuePayment,
            portalAccess = false, // Default value
            whatsAppMobileNo1,
            Remaining,
            accApproval,
            accHeadApproval,
            paymentSlipReference = "", // Default empty string
            paymentSlipReferenceCheck = "", // Default empty string
            studentDetails = {},
            addSchoolDetails = {},
            addUniversityInstitution = {},
            workPlaceDetails = {},
            Installments = [],
            PaymentHistory = [],
        } = req.body;

        // Validate required fields
        if (!campusName || !studentID || !studentName || !whatsAppMobileNo1) {
            return res.status(400).json({
                message:
                    "Missing required fields: campusName, studentID, studentName, password, whatsAppMobileNo1",
            });
        }

        // Check if studentID or whatsAppMobileNo1 already exists
        const existingStudent = await CoordinateAddStudentModel.findOne({
            $or: [{ studentID }, { whatsAppMobileNo1 }],
        });

        if (existingStudent) {
            const conflictField =
                existingStudent.studentID === studentID
                    ? "studentID"
                    : "whatsAppMobileNo1";
            return res.status(409).json({
                message: `${conflictField} already exists in the system`,
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create new student record (without PaymentHistory first)
        const newStudent = new CoordinateAddStudentModel({
            campusName,
            courseTitle: Array.isArray(courseTitle)
                ? courseTitle
                : [courseTitle].filter(Boolean),
            paymentPlan,
            studentID,
            studentName,
            StudentNIC,
            childHoodNIC,
            password: passwordHash,
            whatsAppMobileNo1,
            disCount,
            paymentAmount,
            paidAmount,
            firstDuePayment,
            portalAccess,
            Remaining,
            accApproval,
            accHeadApproval,
            paymentSlipReference,
            paymentSlipReferenceCheck,
            studentDetails: {
                ...studentDetails,
                gender:
                    studentDetails.gender &&
                    ["Male", "Female"].includes(studentDetails.gender)
                        ? studentDetails.gender
                        : undefined,
            },
            addSchoolDetails,
            addUniversityInstitution,
            workPlaceDetails,
            Installments: Installments.map((installment) => ({
                ...installment,
                paymentStatus: ["No Paid", "Paid", "Pending", "Checking"].includes(
                    installment.paymentStatus
                )
                    ? installment.paymentStatus
                    : "Pending",
            })),
            PaymentHistory: [], // Initialize empty array
        });

        // Save to database
        const savedStudent = await newStudent.save();

        // Now handle PaymentHistory with proper ObjectId reference
        if (PaymentHistory && PaymentHistory.length > 0) {
            const paymentHistoryWithRef = PaymentHistory.map(payment => ({
                ...payment,
                coordinateAddStudentPay: savedStudent._id // Link to the saved student
            }));

            // Update the student with payment history
            savedStudent.PaymentHistory = paymentHistoryWithRef;
            await savedStudent.save();
        }

        // Generate token (optional)
        const token = jwt.sign(
            {
                id: savedStudent._id,
                studentID: savedStudent.studentID,
                role: "student",
            },
            secret,
            { expiresIn: "1h" }
        );

        // Return response without sensitive data
        const studentResponse = savedStudent.toObject();
        delete studentResponse.password;

        res.status(201).json({
            success: true,
            message: "Student added successfully",
            student: studentResponse,
            token, // Optional
        });
    } catch (error) {
        console.error("Error adding student:", error);

        // Handle specific MongoDB errors
        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                error: error.message,
            });
        }

        if (error.code === 11000) {
            // Duplicate key error
            return res.status(409).json({
                success: false,
                message: "Duplicate value for unique field",
                error: error.keyValue,
            });
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error:
                process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
},
  // Get all students function
  getAllStudents: async (req, res) => {
    try {
      // Fetch all students and populate related fields
      const students = await CoordinateAddStudentModel.find().populate(
        "courseTitle"
      );

      // Send response with all students
      res.status(200).json(students);
    } catch (error) {
      // Handle any errors
      console.error("Error fetching students:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },

  getStudentByCourse: async (req, res) => {
    const { id } = req.params; // Get course ID from URL parameter
    try {
      // Validate course ID
      if (!id) {
        return res.status(400).json({ message: "Course ID is required" });
      }
  
      // Fetch students by course ID
      const students = await CoordinateAddStudentModel.find({
        courseTitle: { $in: [id] }, // Match course ID in the courseTitle array
      }).populate("courseTitle"); // Populate course details if needed
  
      if (students.length === 0) {
        return res.status(404).json({ message: "No students found for this course" });
      }
  
      // Send response with students
      res.status(200).json(students);
    } catch (error) {
      // Handle any errors
      console.error("Error fetching students by course:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  },
  

  getLoginStudent: async (req, res) => {
    const { studentID, whatsAppMobileNo1 } = req.body;

    try {
      // Validate input
      if (!studentID || !whatsAppMobileNo1) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Fetch student by both studentID and whatsAppMobileNo1
      const existingStudent = await CoordinateAddStudentModel.findOne({
        studentID,
        whatsAppMobileNo1,
      });

      if (!existingStudent) {
        return res
          .status(404)
          .json({ message: "Student ID or WhatsApp number not found" });
      }

      // Generate JWT token, including relevant student details
      const token = jwt.sign(
        {
          id: existingStudent._id, // MongoDB ObjectId
          studentID: existingStudent.studentID,
          studentName: existingStudent.studentName,
          whatsAppMobileNo1: existingStudent.whatsAppMobileNo1,
        },
        secret,
        { expiresIn: "1h" }
      );

      // Send response with token and user info
      res.status(200).json({
        message: "Student login successful",
        token,
        whatsAppMobileNo1: existingStudent.whatsAppMobileNo1,
        studentID: existingStudent.studentID,
        studentName: existingStudent.studentName,
        studentObjectId: existingStudent._id, // Include the MongoDB ObjectId
        studentPortalAccess: existingStudent.portalAccess,
      });

      console.log("Student login successful:", existingStudent);
      console.log("whatsAppMobileNo1:", existingStudent.whatsAppMobileNo1);
      console.log("studentObjectId:", existingStudent._id);
    } catch (error) {
      console.error("Error during student login:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },

  updateStudent: async (req, res) => {
    const { id } = req.params;
    const {
      campusName,
      courseTitle,
      paymentPlan,
      studentID,
      studentName,
      StudentNIC,
      childHoodNIC,
      password,
      disCount,
      paymentAmount,
      paidAmount,
      firstDuePayment,
      whatsAppMobileNo1,
      Remaining,
      accApproval,
      accHeadApproval,
      paymentSlipReference,
      studentDetails,
      addSchoolDetails,
      addUniversityInstitution,
      workPlaceDetails,
    } = req.body;

    try {
      // Update student record
      const updatedStudent = {
        campusName,
        courseTitle,
        paymentPlan,
        studentID,
        studentName,
        StudentNIC,
        childHoodNIC,
        password,
        disCount,
        paymentAmount,
        paidAmount,
        firstDuePayment,
        whatsAppMobileNo1,
        Remaining,
        accApproval,
        accHeadApproval,
        paymentSlipReference,
        studentDetails,
        addSchoolDetails,
        addUniversityInstitution,
        workPlaceDetails,
      };

      // Find student by id and update
      const result = await CoordinateAddStudentModel.findByIdAndUpdate(
        id,
        updatedStudent,
        { new: true }
      );

      if (!result) {
        return res.status(404).json({ message: "Student not found" });
      }

      res
        .status(200)
        .json({ message: "Student updated successfully", student: result });
    } catch (error) {
      console.error("Error updating student:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateStudentDetails: async (req, res) => {
    const { id } = req.params;

    try {
      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid student ID format",
        });
      }

      // Check if student exists
      const existingStudent = await CoordinateAddStudentModel.findById(id);
      if (!existingStudent) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      // Extract fields from request body
      const {
        portalAccess,
        studentDetails = {},
        addSchoolDetails = {},
        addUniversityInstitution = {},
        workPlaceDetails = {},
        whatsAppMobileNo1,
      } = req.body;

      // Prepare update data - only update the specified fields
      const updateData = {
        portalAccess:
          portalAccess !== undefined
            ? portalAccess
            : existingStudent.portalAccess,
        whatsAppMobileNo1:
          whatsAppMobileNo1 || existingStudent.whatsAppMobileNo1,
        studentDetails: {
          ...existingStudent.studentDetails,
          ...studentDetails,
          // Validate gender enum
          gender:
            studentDetails.gender &&
            ["Male", "Female"].includes(studentDetails.gender)
              ? studentDetails.gender
              : existingStudent.studentDetails?.gender,
        },
        addSchoolDetails: {
          ...existingStudent.addSchoolDetails,
          ...addSchoolDetails,
        },
        addUniversityInstitution: {
          ...existingStudent.addUniversityInstitution,
          ...addUniversityInstitution,
        },
        workPlaceDetails: {
          ...existingStudent.workPlaceDetails,
          ...workPlaceDetails,
        },
      };

      // Perform the update
      const updatedStudent = await CoordinateAddStudentModel.findByIdAndUpdate(
        id,
        { $set: updateData }, // Use $set to only update the specified fields
        {
          new: true,
          runValidators: true,
        }
      ).select("-password"); // Exclude password from response

      if (!updatedStudent) {
        return res.status(404).json({
          success: false,
          message: "Student not found after update attempt",
        });
      }

      res.status(200).json({
        success: true,
        message: "Student details updated successfully",
        student: updatedStudent,
      });
    } catch (error) {
      console.error("Error updating student details:", error);

      if (error.name === "ValidationError") {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          error: error.message,
        });
      }

      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: "Duplicate value for unique field",
          error: error.keyValue,
        });
      }

      res.status(500).json({
        success: false,
        message: "Internal server error",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  updateInstallments: async (req, res) => {
    const { id } = req.params;
    const { Installments, PaymentHistory } = req.body;

    try {
      const updatedStudent = await CoordinateAddStudentModel.findByIdAndUpdate(
        id,
        {
          $set: { Installments },
          $push: { PaymentHistory: { $each: PaymentHistory || [] } },
        },
        { new: true, runValidators: true }
      );

      if (!updatedStudent) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.status(200).json(updatedStudent);
    } catch (error) {
      console.error("Error updating student:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updatePaymentStatus: async (req, res) => {
    try {
      const { paymentUpdates } = req.body;
      const studentId = req.params.id;

      if (!paymentUpdates || !Array.isArray(paymentUpdates)) {
        return res.status(400).json({
          success: false,
          message: "Invalid payment updates data"
        });
      }

      // Loop and update each PaymentHistory entry
      for (const update of paymentUpdates) {
        await CoordinateAddStudentModel.updateOne(
          {
            _id: studentId,
            "PaymentHistory._id": new mongoose.Types.ObjectId(update._id)
          },
          {
            $set: {
              "PaymentHistory.$.PayHisPaymentStatus": update.PayHisPaymentStatus
            }
          }
        );
      }

      const updatedStudent = await CoordinateAddStudentModel.findById(studentId);
      res.json({
        success: true,
        data: updatedStudent.PaymentHistory,
        message: "Payment statuses updated successfully"
      });
    } catch (err) {
      console.error("Error updating payment statuses:", err);
      res.status(500).json({
        success: false,
        message: "Server error updating payment statuses",
        error: err.message
      });
    }
  },

updatePaymentHistory: async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      paymentId,
      PayHisPaymentStatus,
      payHisAccApproval,
      payHisAccHeadApproval,
      payHisSlipRefCheck,
      PaymentHistoryPaidAmount,
      PaymentHistoryPaidDate,
      PayHisOfficerName
    } = req.body;

    // Validate input
    if (!paymentId) {
      return res.status(400).json({ error: "Payment ID is required" });
    }

    // Prepare update object
    const updateObj = {};
    const setObj = {};

    if (PayHisPaymentStatus) {
      setObj["PaymentHistory.$.PayHisPaymentStatus"] = PayHisPaymentStatus;
    }
    if (payHisAccApproval) {
      setObj["PaymentHistory.$.payHisAccApproval"] = payHisAccApproval;
    }
    if (payHisAccHeadApproval) {
      setObj["PaymentHistory.$.payHisAccHeadApproval"] = payHisAccHeadApproval;
    }
    if (payHisSlipRefCheck !== undefined) {
      setObj["PaymentHistory.$.payHisSlipRefCheck"] = payHisSlipRefCheck;
    }
    if (PaymentHistoryPaidAmount) {
      setObj["PaymentHistory.$.PaymentHistoryPaidAmount"] = PaymentHistoryPaidAmount;
    }
    if (PaymentHistoryPaidDate) {
      setObj["PaymentHistory.$.PaymentHistoryPaidDate"] = PaymentHistoryPaidDate;
    }
    if (PayHisOfficerName) {
      setObj["PaymentHistory.$.PayHisOfficerName"] = PayHisOfficerName;
    }

    if (Object.keys(setObj).length > 0) {
      updateObj.$set = setObj;
    }

    // Find and update the specific payment history
    const updatedStudent = await CoordinateAddStudentModel.findOneAndUpdate(
      {
        _id: id,
        "PaymentHistory._id": paymentId
      },
      updateObj,
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ error: "Student or payment record not found" });
    }

    // If payment was approved, update related installment
    if (payHisAccApproval === "Yes" || PayHisPaymentStatus === "Paid") {
      const payment = updatedStudent.PaymentHistory.find(p => p._id.equals(paymentId));
      
      if (payment) {
        const installmentIndex = updatedStudent.Installments.findIndex(
          inst => inst._id.equals(payment.relatedInstallment)
        );

        if (installmentIndex !== -1) {
          const updatedInstallments = [...updatedStudent.Installments];
          updatedInstallments[installmentIndex] = {
            ...updatedInstallments[installmentIndex],
            paymentStatus: "Paid",
            accApproval: "Yes",
            paymentSlipReferenceCheck: payment.payHisSlipRefCheck || updatedInstallments[installmentIndex].paymentSlipReferenceCheck
          };

          await CoordinateAddStudentModel.findByIdAndUpdate(
            id,
            { $set: { Installments: updatedInstallments } },
            { new: true, runValidators: true }
          );
        }
      }
    }

    res.status(200).json({
      message: "Payment history updated successfully",
      updatedPayment: updatedStudent.PaymentHistory.find(p => p._id.equals(paymentId))
    });
  } catch (error) {
    console.error("Error updating payment history:", error);
    res.status(500).json({ 
      error: "Failed to update payment history",
      details: error.message 
    });
  }
},

handleUpdateStudentImage: async (req, res) => {
  try {
    const { id } = req.params;
    const { imageBase64 } = req.body;

    // 1. Validate input
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid student ID' });
    }

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'Image data is required and must be a string' });
    }

    // 2. Validate base64 image format
    const base64Regex = /^data:image\/(png|jpeg|jpg);base64,/;
    if (!base64Regex.test(imageBase64)) {
      return res.status(400).json({ error: 'Invalid image format. Only PNG, JPEG, or JPG allowed' });
    }

    // 3. Check if student exists
    const existingStudent = await CoordinateAddStudentModel.findById(id);
    if (!existingStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // 4. Update the image
    const updatedStudent = await CoordinateAddStudentModel.findByIdAndUpdate(
      id,
      { profileImage: imageBase64 },
      { new: true, runValidators: true }
    );

    // 5. Return success response
    res.status(200).json({
      success: true,
      message: 'Image updated successfully',
      student: updatedStudent
    });

  } catch (error) {
    console.error('Error in handleUpdateStudentImage:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.message 
      });
    }
    
    // Handle other errors
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
},
};

module.exports = CoordinatorAddStudentController;
