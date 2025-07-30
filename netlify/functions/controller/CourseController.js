const CourseModel = require('../model/CourseModel');
const SubjectModel = require('../model/SubjectModel');
const CampusModel = require('../model/CampusModel');
const jwt = require('jsonwebtoken');
const secret = 'test'; // Consider using an environment variable for the secret

const CourseController = {
    courseCreate: async (req, res) => {
        const { courseTitle, courseLevel,orientationDay, courseDuration, totalCourseFee, subject, campus, language, backendWhatsappNumber, initialStudentNumber, courseCode
        } = req.body;

        try {
            // Validate required fields
            if (!courseTitle || !courseLevel || !courseDuration || !totalCourseFee) {
                return res.status(400).json({ message: "All fields are required" });
            }

            // Check if the subjects exist if provided
            if (subject && Array.isArray(subject)) {
                const existingSubjects = await SubjectModel.find({ '_id': { $in: subject } });
                if (existingSubjects.length !== subject.length) {
                    return res.status(400).json({ message: "One or more subjects do not exist" });
                }
            }

            // Check if the campus exist if provided
            if (campus && Array.isArray(campus)) {
                const existingCampus = await CampusModel.find({ '_id': { $in: campus } });
                if (existingCampus.length !== campus.length) {
                    return res.status(400).json({ message: "One or more campus do not exist" });
                }
            }

            // Check if the course already exists by title
            const existingCourse = await CourseModel.findOne({ courseTitle });
            if (existingCourse) {
                return res.status(400).json({ message: "Course already exists" });
            }

            // Create a new course
            const newCourse = new CourseModel({
                courseTitle,
                orientationDay,
                courseLevel,
                courseDuration,
                totalCourseFee,
                subject, // This will be a reference to the Subject model
                campus, // This will be a reference to the Campus model
                language,
                backendWhatsappNumber,
                initialStudentNumber,
                courseCode
            });

            const result = await newCourse.save();

            // Return success response
            res.status(201).json({ message: "Course created successfully", result });
            console.log("Course created successfully:", result);

        } catch (error) {
            // Handle validation and other errors
            console.error("Error occurred while creating course:", error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    },

    getAllCourse: async (req, res) => {
        try {
            const courses = await CourseModel.find().
                populate('subject').populate('campus');
            res.status(200).json({ courses });
            console.log("Courses retrieved successfully:", courses);

        } catch (error) {
            console.error("Error occurred while retrieving courses:", error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    },

    courseUpdate: async (req, res) => {
        const { id } = req.params;
        const { courseTitle, courseLevel,orientationDay ,courseDuration, totalCourseFee, subject, campus, language } = req.body;

        try {
            // Validate required fields
            if (!courseTitle || !courseLevel || !courseDuration || !totalCourseFee) {
                return res.status(400).json({ message: "All fields are required" });
            }

            // Check if the subjects exist if provided
            if (subject && Array.isArray(subject)) {
                const existingSubjects = await SubjectModel.find({ '_id': { $in: subject } });
                if (existingSubjects.length !== subject.length) {
                    return res.status(400).json({ message: "One or more subjects do not exist" });
                }
            }

            // Check if the campus exist if provided
            if (campus && Array.isArray(campus)) {
                const existingCampus = await CampusModel.find({ '_id': { $in: campus } });
                if (existingCampus.length !== campus.length) {
                    return res.status(400).json({ message: "One or more campus do not exist" });
                }
            }

            // Check if the course exists
            const existingCourse = await CourseModel.findById(id);
            if (!existingCourse) {
                return res.status(404).json({ message: "Course not found" });
            }

            // Update the course
            const updatedCourse = await CourseModel.findByIdAndUpdate(id, {
                courseTitle,
                courseLevel,
                orientationDay,
                courseDuration,
                totalCourseFee,
                subject, // This will be a reference to the Subject model
                campus, // This will be a reference to the Campus model
                language
            }, { new: true });

            // Return success response
            res.status(200).json({ message: "Course updated successfully", updatedCourse });
            console.log("Course updated successfully:", updatedCourse);

        } catch (error) {
            // Handle validation and other errors
            console.error("Error occurred while updating course:", error);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    },
    // Add this method to your CourseController object
getCoursesByCampus: async (req, res) => {
    const { campusId } = req.params;
    
    try {
        // Validate campus ID
        if (!campusId) {
            return res.status(400).json({ message: "Campus ID is required" });
        }

        // Check if campus exists
        const campusExists = await CampusModel.findById(campusId);
        if (!campusExists) {
            return res.status(404).json({ message: "Campus not found" });
        }

        // Find courses that include this campus in their campus array
        const courses = await CourseModel.find({ campus: campusId })
            .populate('subject')
            .populate('campus');

        res.status(200).json({ 
            message: "Courses retrieved successfully",
            courses 
        });
        console.log(`Courses for campus ${campusId} retrieved successfully`);

    } catch (error) {
        console.error("Error occurred while retrieving courses by campus:", error);
        res.status(500).json({ 
            message: 'Internal Server Error', 
            error: error.message 
        });
    }
}
}

module.exports = CourseController;
