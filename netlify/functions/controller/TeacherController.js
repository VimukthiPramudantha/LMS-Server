const TeacherModel = require("../model/TeacherModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const secret = process.env.JWT_SECRET || "defaultSecret"; // Use environment variable for JWT secret
const secret='test'; // Secret key for JWT

const TeacherController = {
   // Create a new teacher
   createTeacher: async (req, res) => {
      const { teacherId, password, name, referenceNo, contactNo, email } = req.body;

      try {
         // Validate required fields
         if (!teacherId || !password || !name) {
            return res.status(400).json({ message: "Teacher ID, name, and password are required." });
         }

         // Check if the teacher already exists
         const existingTeacher = await TeacherModel.findOne({ teacherId });
         if (existingTeacher) {
            return res.status(400).json({ message: "Teacher already exists." });
         }

         // Hash the password before saving
         // const hashedPassword = await bcrypt.hash(password, 10);

         // Create a new teacher
         const newTeacher = new TeacherModel({
            teacherId,
            password: password,
            name: name, // Normalize name
            referenceNo,
            contactNo,
            email,
         });

         const result = await newTeacher.save();

         res.status(201).json({ result });
      } catch (error) {
         console.error("Error creating teacher:", error);
         res.status(500).json({ message: "An internal server error occurred." });
      }
   },

   // Get all teachers
   getAllTeachers: async (req, res) => {
      try {
            const teachers = await TeacherModel.find();
            res.status(200).json(teachers);
      } catch (error) {
            console.error("Error fetching Teachers:", error);
            res.status(500).json({ message: "Something went wrong" });
      }
   },


   // Update a teacher
   updateTeacher: async (req, res) => {
      const { id } = req.params;
      const { teacherId, password, name, referenceNo, contactNo, email } = req.body;

      try {
         // Find the teacher by ID
         const teacher = await TeacherModel.findById(id);
         if (!teacher) {
            return res.status(404).json({ message: "Teacher not found." });
         }

         // Update fields if they are provided
         if (teacherId) teacher.teacherId = teacherId;
         if (password) teacher.password = password; // Do not hash the new password
         if (name) teacher.name = name; // Normalize name
         if (referenceNo) teacher.referenceNo = referenceNo;
         if (contactNo) teacher.contactNo = contactNo;
         if (email) teacher.email = email;

         const result = await teacher.save();

         res.status(200).json({ result });
      } catch (error) {
         console.error("Error updating teacher:", error);
         res.status(500).json({ message: "An internal server error occurred." });
      }
   },

   // Delete a teacher
   deleteTeacher: async (req, res) => {
      const { id } = req.params;

      try {
         const teacher = await TeacherModel.findById(id);
         if (!teacher) {
            return res.status(404).json({ message: "Teacher not found." });
         }

         await teacher.remove();
         res.status(200).json({ message: "Teacher deleted successfully." });
      } catch (error) {
         console.error("Error deleting teacher:", error);
         res.status(500).json({ message: "An internal server error occurred." });
      }
   },

   // Teacher login
   loginTeacher: async (req, res) => {
      const { name, password } = req.body;


      try {
         // Validate required fields
         if (!name || !password) {
             return res.status(400).json({ message: "teacher Name and Password are required" });
         }

          // Check if the coordinator exists
          const existingTeacher = await TeacherModel.findOne({ name });
          if (!existingTeacher) {
              return res.status(400).json({ message: "Teacher does not exist" });
          }

          if (password !==password) {
            return res.status(400).json({ message: "Invalid password" });
        }


         // Generate a JWT token
         const token = jwt.sign(
            {
               id: existingTeacher._id,
               name: existingTeacher.name,
               teacherId: existingTeacher.teacherId,
               role:"Teacher",
            },
            secret,
            { expiresIn: "1h" }
         );

         res.status(200).json({ result: existingTeacher, token });
         console.log("Teacher login successful:", existingTeacher);
      } catch (error) {
         console.error("Teacher login failed:", error.message);
         res.status(500).json({ message: "An internal server error occurred." });
      }
   },
   
};

module.exports = TeacherController;
