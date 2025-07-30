const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = 'test';
const StudentDetailsModel = require('../model/StudentDetailsModel');
const ClassDetailsModel = require('../model/ClassDetailsModel');
const CoordinateAddStudentModel = require('../model/CoordinateAddStudentModel');

const StudentDetailsController = {

        // Function to let a student join a class
        addStudentJoinClass: async (req, res) => {
            const {
                studentId,
                subject,
                studentName,
                startAt,
                endAt,
                classDay,
            } = req.body;
    
            try {

                    // Validate required fields
                    if (!studentId || !subject || !studentName || !startAt || !endAt || !classDay) {
                        return res.status(400).json({ message: "All required fields must be provided" });
                    }
        
                    // Check if student exists
                    // const existingStudent = await StudentDetailsModel.findById(studentId);
                    // if (!existingStudent) {
                    //     return res.status(403).json({ message: "Student not found 2" });
                    // }
                // Create a new class entry
                const newClassDetails = new ClassDetailsModel({
                    studentId,
                    subject,
                    studentName,
                    startAt,
                    endAt,
                    classDay,
                });
    
                // Save the class details
                const result = await newClassDetails.save();
    
                res.status(201).json({ message: "Student successfully joined the class", result });
            } catch (error) {
                console.error("Error adding student to class:", error);
                res.status(500).json({ message: "Error adding student to class", error: error.message });
            }
        },
    // Add new student details
    addStudentDetails: async (req, res) => {
        const {
            fullName,
            fullNameCertificate,
            addressStudent,
            postAddressStudent,
            dob,
            gender,
            whatsAppMobileNo1,
            whatsAppMobileNo2,
            addSchoolDetails,
            addUniversityInstitution,
            workPlaceDetails,
        } = req.body;

        try {
            // // Validate required fields
            // if (!fullName || !fullNameCertificate || !dob || !gender || !whatsAppMobileNo1) {
            //     return res.status(400).json({ message: "All required fields must be provided" });
            // }

            // Ensure the Authorization header exists
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(403).json({ message: "No token provided" });
            }

            // Extract and verify the token
            const token = authHeader.split(" ")[1];
            let decodedData;
            try {
                decodedData = jwt.verify(token, secret);
            } catch (error) {
                return res.status(401).json({ message: "Invalid or expired token" });
            }

            // Check if the WhatsApp mobile number exists in CoordinateAddStudentModel
            const existingStudent = await CoordinateAddStudentModel.findOne({ whatsAppMobileNo1 });
            if (!existingStudent) {
                return res.status(404).json({ message: "WhatsApp mobile number does not exist in the CoordinateAddStudent collection" });
            }

            // Create new student details
            const newStudentDetails = new StudentDetailsModel({
                fullName,
                fullNameCertificate,
                addressStudent,
                postAddressStudent, // Added compatibility for postAddressStudent
                dob,
                gender,
                whatsAppMobileNo1,
                whatsAppMobileNo2,
                addSchoolDetails, // Added compatibility for school details
                addUniversityInstitution, // Added compatibility for university details
                workPlaceDetails, // Added compatibility for workplace details
            });

            // Save the new student details in the database
            const result = await newStudentDetails.save();

            // Return success response
            res.status(201).json({ message: "Student details created successfully", result });
        } catch (error) {
            console.error("Error creating student details:", error);
            res.status(500).json({ message: "Error creating student details", error: error.message });
        }
    },

    // Get all student details
    getAllStudentDetails: async (req, res) => {
        try {
            // Fetch all student details
            const studentDetails = await StudentDetailsModel.find();

            // Send success response with the fetched details
            res.status(200).json({ message: "Student details fetched successfully", studentDetails });
        } catch (error) {
            console.error("Error fetching student details:", error);
            res.status(500).json({ message: "Error fetching student details", error: error.message });
        }
    },

    // Update student details by ID
    updateStudentDetails: async (req, res) => {
        const { id } = req.params; // StudentDetails ID
        const {
            fullName,
            fullNameCertificate,
            addressStudent,
            postAddressStudent,
            dob,
            gender,
            whatsAppMobileNo1,
            whatsAppMobileNo2,
            addSchoolDetails,
            addUniversityInstitution,
            workPlaceDetails,
        } = req.body;

        try {
            // Find student details by ID and update
            const updatedStudentDetails = await StudentDetailsModel.findByIdAndUpdate(
                id,
                {
                    fullName,
                    fullNameCertificate,
                    addressStudent,
                    postAddressStudent,
                    dob,
                    gender,
                    whatsAppMobileNo1,
                    whatsAppMobileNo2,
                    addSchoolDetails,
                    addUniversityInstitution,
                    workPlaceDetails,
                },
                { new: true } // Return the updated document
            );

            if (!updatedStudentDetails) {
                return res.status(404).json({ message: "Student details not found" });
            }

            // Return success response
            res.status(200).json({ message: "Student details updated successfully", updatedStudentDetails });
        } catch (error) {
            console.error("Error updating student details:", error);
            res.status(500).json({ message: "Error updating student details", error: error.message });
        }
    },

    // Get student details by ID
    getStudentDetailsById: async (req, res) => {
        const { id } = req.params;

        try {
            // Find student details by ID
            const studentDetails = await StudentDetailsModel.findById(id);

            if (!studentDetails) {
                return res.status(404).json({ message: "Student details not found" });
            }

            // Return success response
            res.status(200).json({ message: "Student details fetched successfully", studentDetails });
        } catch (error) {
            console.error("Error fetching student details:", error);
            res.status(500).json({ message: "Error fetching student details", error: error.message });
        }
    },

};

module.exports = StudentDetailsController;
