const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secret='test';

const StudentWorkPlaceModel = require('../model/StudentWorkPlaceModel');

const StudentWorkPlaceController = {
    addWorkPlace: async (req, res) => {
        const { currentJobTitle, companyName, jobLocation, jobType, jobStartDate } = req.body;

        try {
            // Check if all required fields are provided
            if (!currentJobTitle || !companyName || !jobLocation || !jobType || !jobStartDate) {
                return res.status(400).json({ message: "All fields are required" });
            }

            // Ensure the Authorization header exists
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(403).json({ message: "No token provided" });
            }

            // Extract token from Authorization header
            const token = authHeader.split(" ")[1];
            if (!token) {
                return res.status(403).json({ message: "No token provided" });
            }

            // Verify token
            let decodedData;
            try {
                decodedData = jwt.verify(token, secret);
            } catch (error) {
                return res.status(401).json({ message: "Invalid or expired token" });
            }

            // Create new student work place
            const newStudentWorkPlace = new StudentWorkPlaceModel({
                currentJobTitle,
                companyName,
                jobLocation,
                jobType,
                jobStartDate
            });

            // Save the new student work place in the database
            const result = await newStudentWorkPlace.save();

            // Return success response
            res.status(201).json({ result });
            console.log("Student work place created successfully:", result);
        } catch (error) {
            res.status(500).json({ message: error.message });
            console.error("Error creating student work place:", error);
        }
    },

    getWorkPlace: async (req, res) => {
        try {
            // Ensure the Authorization header exists
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(403).json({ message: "No token provided" });
            }

            // Extract token from Authorization header.
            const token = authHeader.split(" ")[1];
            if (!token) {
                return res.status(403).json({ message: "No token provided" });
            }

            // Verify token
            let decodedData;
            try {
                decodedData = jwt.verify(token, secret);
            } catch (error) {
                return res.status(401).json({ message: "Invalid or expired token" });
            }

            // Get all student work places
            const studentWorkPlaces = await StudentWorkPlaceModel.find();

            // Return success response
            res.status(200).json({ studentWorkPlaces });
            console.log("Student work places retrieved successfully:", studentWorkPlaces);
        } catch (error) {
            res.status(500).json({ message: error.message });
            console.error("Error retrieving student work places:", error);
        }
    },

}

module.exports = StudentWorkPlaceController;
