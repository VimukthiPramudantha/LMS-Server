const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const CampusModal = require('../model/CampusModel');

const secret = 'test';

const CampusController = {
        getCampusById: async (req, res) => {
        const { id } = req.params;

        try {
            // Check if ID is provided
            if (!id) {
                return res.status(400).json({ message: "Campus ID is required" });
            }

            // Find campus by ID
            const campus = await CampusModal.findById(id);

            if (!campus) {
                return res.status(404).json({ message: "Campus not found" });
            }

            res.status(200).json(campus);

        } catch (error) {
            // Handle invalid ID format
            if (error.name === 'CastError') {
                return res.status(400).json({ message: "Invalid campus ID format" });
            }

            console.error("Error fetching campus by ID:", error);
            res.status(500).json({ 
                message: 'Error fetching campus details',
                error: error.message 
            });
        }
    },
    
    campusCreate: async (req, res) => {
        const { campusName, manageFiled,mktdepartment,mktdivision,projectNo,createdByDirector } = req.body;

        try {
            // Check if the required fields are provided
            if (!campusName || !manageFiled) {
                return res.status(400).json({ message: "Campus name and courses are required" });
            }

            // Check if the campus already exists by name
            const existingCampus = await CampusModal.findOne({ campusName });

            if (existingCampus) {
                return res.status(400).json({ message: "Campus already exists" });
            }

            // Create a new campus
            const newCampus = new CampusModal({
                campusName,
                manageFiled,
                mktdepartment,
                mktdivision,
                projectNo,
                createdByDirector
            });

            const result = await newCampus.save();

            // Generate a JWT token
            const token = jwt.sign({
                id: result._id,
                campusName: result.campusName,
                manageFiled: result.manageFiled
            }, secret, { expiresIn: "1h" });

            res.status(201).json({ result, token });

        } catch (error) {
            // More descriptive error handling
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: "Validation error", details: error.message });
            }

            // Log the actual error for debugging
            console.error("Error occurred while creating campus:", error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    },

    getAllCampuses: async (req, res) => {
        try {
            const campuses = await CampusModal.find();/*.populate('course', 'courseTitle')*/ // Populate the course field with courseTitle
            res.status(200).json(campuses);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching campuses' });
        }
    },

    campusUpdate: async (req, res) => {
        const { id } = req.params;
        const { campusName, manageFiled } = req.body;

        try {
            // Check if the required fields are provided
            if (!campusName || !Array.isArray(manageFiled)) {
                return res.status(400).json({ message: "Campus name and courses are required" });
            }

            // Check if the campus exists
            const existingCampus = await CampusModal.findById(id);

            if (!existingCampus) {
                return res.status(404).json({ message: "Campus not found" });
            }

            // Update the campus
            existingCampus.campusName = campusName;
            existingCampus.manageFiled = manageFiled;

            const result = await existingCampus.save();

            // Optional: If token is needed, generate it
            const token = jwt.sign({
                id: result._id,
                campusName: result.campusName,
                manageFiled: result.manageFiled
            }, secret, { expiresIn: "1h" });

            res.status(200).json({ result, token });

        } catch (error) {
            // More descriptive error handling
            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: "Validation error", details: error.message });
            }

            // Log the actual error for debugging
            console.error("Error occurred while updating campus:", error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    }
};

module.exports = CampusController;
