const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secret = "test";
const StudentEducationDetailModel = require("../model/StudentEducationDetail");

const StudentEducationDetailController = {
  addEducationDetails: async (req, res) => {
    const {
      universityInstitution,
      degreeDiploma,
      fieldOfStudy,
      startDate,
      endDate,
    } = req.body;

    try {
      // Check if all required fields are provided
      if (
        !universityInstitution ||
        !degreeDiploma ||
        !fieldOfStudy ||
        !startDate ||
        !endDate
      ) {
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
      
        const newStudentEducation = new StudentEducationDetailModel({

              universityInstitution,
              degreeDiploma,
              fieldOfStudy,
              startDate,
              endDate,
        });

        const result = await newStudentEducation.save();

              // Return success response
      res.status(201).json({ result });
      console.log("Education created successfully:", result);
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.error("Error adding education:", error);
    }
  },

  getEducation: async (req, res) => {
    try {
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

      // Fetch education records for the student
      const studentEducation = await StudentEducationDetailModel.findOne({
        userId: decodedData?.id,
      });

      if (!studentEducation) {
        return res.status(404).json({ message: "No education records found" });
      }

      res.status(200).json(studentEducation);
    } catch (error) {
      res.status(500).json({ message: error.message });
      console.error("Error fetching education records:", error);
    }
  },
};

module.exports = StudentEducationDetailController;
