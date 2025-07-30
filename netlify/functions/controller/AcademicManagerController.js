const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const AcademicManagerModel=require('../model/AcademicManagerModel');

const secret='test';

const AcademicManagerController = {

    academicManagerCreate: async (req, res) => {
        const { AcademicManagerId, name, managedRoles, createdCourses, campus, password } = req.body;

        try {
            const existingAcademicManager = await AcademicManagerModel.findOne({ AcademicManagerId });

            if (existingAcademicManager) {
                return res.status(400).json({ message: "Academic Manager already exists" });
            }

            const newAcademicManager = new AcademicManagerModel({
                AcademicManagerId,
                name,
                managedRoles,
                createdCourses,
                campus,
                password: await bcrypt.hash(password, 12) // Hash the password before storing
            });

            const result = await newAcademicManager.save();

            const token = jwt.sign(
                { AcademicManagerId: result.AcademicManagerId, id: result._id },
                secret,
                { expiresIn: "1h" }
            );

            res.status(200).json({ result, token });

        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' });
            console.error(error);
        }
    },

    // Get all Academic Managers
    getAllAcademicManagers: async (req, res) => {
      try {
          const academicManagers = await AcademicManagerModel.find();
          res.status(200).json(academicManagers);
      } catch (error) {
          res.status(500).json({ message: 'Something went wrong' });
          console.error(error);
      }
  },


  academicManagerLogin: async (req, res) => {
   const { name, password } = req.body;

   try {
       // Validate required fields
       if (!name || !password) {
           return res.status(400).json({ message: "Academic Manager Name and Password are required" });
       }

       // Check if the academic manager exists
       const existingAcademicManager = await AcademicManagerModel.findOne({ name });
       if (!existingAcademicManager) {
           return res.status(400).json({ message: "Academic Manager does not exist" });
       }

       // Check if the password is correct
       if (password !== existingAcademicManager.password) {
           return res.status(400).json({ message: "Invalid password" });
       }

       // Generate JWT token
       const token = jwt.sign({
           id: existingAcademicManager._id,
           name: existingAcademicManager.name,
           managedRoles: existingAcademicManager.managedRoles,
           createdCourses: existingAcademicManager.createdCourses,
           campus: existingAcademicManager.campus,
           role: "AcademicManager"
       }, secret, { expiresIn: "1h" });

       // Return success response
       res.status(200).json({ result: existingAcademicManager, token });
       console.log("Academic Manager login successful:", existingAcademicManager);

   } catch (error) {
       // Handle validation and other errors
       console.error("Academic Manager login failed:", error);
       res.status(500).json({ message: "Academic Manager login failed", error: error.message });
   }
},

  

}

module.exports=AcademicManagerController;
