const ITExecutiveModel = require('../model/ITExicutiveModel');
const jwt = require('jsonwebtoken'); // For generating a token
const secret = 'test'; // Secret key for JWT

const ITExicutiveController = {
    createITExecutive: async (req, res) => {
        const { name, password, ITExecutiveIsDirector, ITExecutiveID } = req.body;
    
        try {
            if (!name || !password) {
                return res.status(400).json({ message: "Name and password are required" });
            }
    
            const existingExecutive = await ITExecutiveModel.findOne({ name });
            if (existingExecutive) {
                return res.status(400).json({ message: "IT Executive already exists" });
            }
    
            const newExecutive = new ITExecutiveModel({
                name,
                password, // Directly store the password without hashing
                ITExecutiveIsDirector,
                ITExecutiveID
            });
    
            const result = await newExecutive.save();
            res.status(201).json({ result });
        } catch (error) {
            console.error("Error creating IT Executive:", error);
            res.status(500).json({ message: "Something went wrong" });
        }
    },

    getAllITExecutives: async (req, res) => {
        try {
            const itExecutives = await ITExecutiveModel.find();
            res.status(200).json(itExecutives);
        } catch (error) {
            console.error("Error fetching IT Executives:", error);
            res.status(500).json({ message: "Something went wrong" });
        }
    },

    updateITExecutive: async (req, res) => {
        const { id } = req.params;
        const { name, password, ITExecutiveIsDirector, ITExecutiveID } = req.body;
    
        try {
            const itExecutive = await ITExecutiveModel.findById(id);
            if (!itExecutive) {
                return res.status(404).json({ message: "IT Executive not found" });
            }
    
            if (name) itExecutive.name = name;
            if (password) {
                itExecutive.password = password; // Directly update the password without hashing
            }
            if (typeof ITExecutiveIsDirector !== 'undefined') {
                itExecutive.ITExecutiveIsDirector = ITExecutiveIsDirector;
            }
            if (ITExecutiveID) itExecutive.ITExecutiveID = ITExecutiveID;
    
            const updatedExecutive = await itExecutive.save();
            res.status(200).json(updatedExecutive);
        } catch (error) {
            console.error("Error updating IT Executive:", error);
            res.status(500).json({ message: "Something went wrong" });
        }
    },
// IT Executive Login
loginITExecutive: async (req, res) => {
    const { name, password } = req.body;

    try {
        // Validate required fields
        if (!name || !password) {
            return res.status(400).json({ message: "IT Executive Name and Password are required" });
        }

        // Check if the IT Executive exists
        const existingITExecutive = await ITExecutiveModel.findOne({ name });
        if (!existingITExecutive) {
            return res.status(404).json({ message: "IT Executive does not exist" });
        }

        // Directly compare the password
        if (password !== existingITExecutive.password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
                    // Ensure only ITExecutiveIsDirector with ITExecutive: true can log in
                    if (!existingITExecutive.ITExecutiveIsDirector) {
                        return res.status(403).json({ message: "Access denied get the permission from the Director " });
                    }
        console.log("IT Executive login successful:", existingITExecutive);
        // Generate a JWT token
        const token = jwt.sign(
            {
                id: existingITExecutive._id,
                name: existingITExecutive.name,
                ITExecutiveID: existingITExecutive.ITExecutiveID,
                role:"ITExecutive",
            },
            secret, // Replace with a secure secret key
            { expiresIn: "1h" } // Token validity
        );

        // Respond with the token and IT Executive data
        res.status(200).json({ result: existingITExecutive, token });
        console.log("IT Executive login successful:", existingITExecutive);
    } catch (error) {
        console.error("Error logging in IT Executive:", error.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}

};

module.exports = ITExicutiveController;
