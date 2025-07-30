const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const secret = "test";
const SubjectModel = require("../model/SubjectModel");
const mongoose = require("mongoose");

const SubjectController = {
  // Create a new subject
  subjectCreate: async (req, res) => {
    const {
      subjectId,
      subjectName,
      lectureName,
      classDay,
      sessionStartTime,
      sessionEndTime,
      zoomId,
      zoomPassword,
      classLink,
      status,
    } = req.body;

    try {
      // Validate input fields
      if (
        !subjectId ||
        !subjectName ||
        !classDay ||
        !lectureName ||
        !sessionStartTime ||
        !sessionEndTime
      ) {
        return res
          .status(400)
          .json({ message: "All required fields must be filled" });
      }

      // Check if the subject already exists by subjectId or subjectName
      const existingSubject = await SubjectModel.findOne({
        $or: [{ subjectId }, { subjectName }],
      }).exec();

      if (existingSubject) {
        return res
          .status(400)
          .json({ message: "Subject with this ID or name already exists" });
      }

      // Create a new subject
      const newSubject = new SubjectModel({
        subjectId,
        subjectName,
        classDay,
        lectureName,
        sessionStartTime,
        sessionEndTime,
        zoomId: zoomId || "",
        zoomPassword: zoomPassword || "",
        classLink: classLink || "",
        status: status !== undefined ? status : true,
      });

      const result = await newSubject.save();
      res.status(201).json({ result });
    } catch (error) {
      console.error("Error occurred while creating subject:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },

  // Get subject by ID
  getSubjectById: async (req, res) => {
    const { id } = req.params;

    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid subject ID" });
      }

      const subject = await SubjectModel.findById(id);

      if (!subject) {
        return res.status(404).json({ message: "Subject not found" });
      }

      res.status(200).json({ subject });
    } catch (error) {
      console.error("Error fetching the subject:", error.message);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },

  // Get all subjects without pagination or filters (for testing)
  getAllSubjectsNoLimit: async (req, res) => {
    try {
      const subjects = await SubjectModel.find({}); // Fetch all subjects without filters or pagination
      res.status(200).json({ subjects });
    } catch (error) {
      console.error("Error fetching subjects:", error.message);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },

      // Get all subjects with optional filtering and pagination
      getAllSubjects: async (req, res) => {
        const { page = 1, limit = 10, ids, status } = req.query;

        try {
            let query = {};

            if (ids) {
                const subjectIds = ids.split(',').map(id => new mongoose.Types.ObjectId(id));
                query._id = { $in: subjectIds };
            }

            if (status !== undefined) {
                query.status = status === 'true'; 
            }

            const subjects = await SubjectModel.find(query)
                .skip((page - 1) * limit)
                .limit(limit);

            const totalSubjects = await SubjectModel.countDocuments(query);
            res.status(200).json({
                subjects,
                totalSubjects,
                currentPage: page,
                totalPages: Math.ceil(totalSubjects / limit),
            });

        } catch (error) {
            console.error('Error fetching subjects:', error.message);
            res.status(500).json({ message: 'Internal Server Error', error: error.message });
        }
    },

  // Update subject
  subjectUpdate: async (req, res) => {
    const { id } = req.params;
    const {
      subjectId,
      subjectName,
      classDay,
      lectureName,
      sessionStartTime,
      sessionEndTime,
      zoomId,
      zoomPassword,
      classLink,
      status,
    } = req.body;

    try {
      if (
        !subjectId ||
        !subjectName ||
        !classDay ||
        !lectureName ||
        !sessionStartTime ||
        !sessionEndTime
      ) {
        return res
          .status(400)
          .json({ message: "All required fields must be filled" });
      }

      const updatedSubject = await SubjectModel.findByIdAndUpdate(
        id,
        {
          subjectId,
          subjectName,
          lectureName,
          classDay,
          sessionStartTime,
          sessionEndTime,
          zoomId,
          zoomPassword,
          classLink,
          status,
        },
        { new: true, runValidators: true }
      );

      if (!updatedSubject) {
        return res.status(404).json({ message: "Subject not found" });
      }

      res.status(200).json({ updatedSubject });
    } catch (error) {
      console.error("Error updating subject:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },
};

module.exports = SubjectController;
