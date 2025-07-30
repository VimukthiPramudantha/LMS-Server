const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const SuperAdminModel = require('../model/SuperAdminModel');
const DirectorModel = require('../model/DirectorModel');

const secret='test';

const SuperAdminController = {

    superAdminCreate: async (req, res) => {
        try {
            const { superAdminId, name, password } = req.body;

            const existingSuperAdmin = await SuperAdminModel.findOne({ superAdminId });

            if (existingSuperAdmin) {
                return res.status(400).json({ message: "Super Admin already exists" });
            }

            const passwordHash = await bcrypt.hash(password, 12);

            const newSuperAdmin = new SuperAdminModel({
                superAdminId,
                name,
                password: passwordHash
            });

            const result = await newSuperAdmin.save();

            const token = jwt.sign(
                { superAdminId: result.superAdminId, id: result._id },
                secret,
                { expiresIn: "1h" }
            );

            res.status(201).json({ result, token });

        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' });
            console.error(error);
        }
    },


    // Function to sign in a Super Admin
    superAdminSignIn: async (req, res) => {

        try {
            const { name, password } = req.body;

            const superAdmin = await SuperAdminModel.findOne({ name });

            if (!superAdmin) {
                return res.status(404).json({ message: "Super Admin doesn't exist" });
            }

            if (superAdmin.role !== "Super Admin") {
                return res.status(403).json({ message: "Unauthorized: Not a Super Admin" });
            }

            const isPasswordCorrect = await bcrypt.compare(password, superAdmin.password);

            if (!isPasswordCorrect) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign(
                { email: superAdmin.email, id: superAdmin._id, role: superAdmin.role },
                secret,
                { expiresIn: "1h" }
            );

            res.status(200).json({ result: superAdmin, token });

        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' });
            console.error(error);
        }
    },

    addDirector: async (req, res) => {
        /*try {
            const { directorId, name, password } = req.body;

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

            // Check if the Super Admin exists
            const superAdmin = await SuperAdminModel.findById(decodedData.id);
            if (!superAdmin) {
                return res.status(403).json({ message: "Access denied: Only Super Admins can create a Director" });
            }

            // Check if the directorId already exists
            const existingDirector = await DirectorModel.findOne({ directorId });
            if (existingDirector) {
                return res.status(400).json({ message: "Director already exists" });
            }

            // Hash the director's password
            const passwordHash = await bcrypt.hash(password, 12);

            // Create a new Director
            const newDirector = new DirectorModel({
                directorId,
                name,
                password: passwordHash
            });

            const result = await newDirector.save();

            // Add the new Director to the Super Admin's managedDirectors
            superAdmin.managedDirectors.push(result._id);
            await superAdmin.save();

            res.status(201).json({ result });

        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' });
            console.error(error);
        }*/
        try {
            const { directorId, name, password } = req.body;

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

            // Check if the Super Admin exists
            const superAdmin = await SuperAdminModel.findById(decodedData.id);
            if (!superAdmin) {
                return res.status(403).json({ message: "Access denied: Only Super Admins can create a Director" });
            }

            // Check if the directorId already exists
            const existingDirector = await DirectorModel.findOne({ directorId });
            if (existingDirector) {
                return res.status(400).json({ message: "Director already exists" });
            }

            // Hash the director's password
            const passwordHash = await bcrypt.hash(password, 12);

            // Create a new Director
            const newDirector = new DirectorModel({
                directorId,
                name,
                password: passwordHash
            });

            // Save the new Director
            const result = await newDirector.save();

            // Add the new Director to the Super Admin's managedDirectors
            superAdmin.managedDirectors.push(result._id);
            await superAdmin.save();

            res.status(201).json({ result });

        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' });
            console.error(error);
        }
    },

    getAllDirectors: async (req, res) => {
        try {
            const directors = await DirectorModel.find();
            res.status(200).json({ directors });
        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' });
            console.error(error);
        }
    },



    dataBaseLastIdCheckDirector: async (req, res) => {
        try {
            const lastAdmin = await DirectorModel.findOne().sort({ id: -1 }).lean();
            let lastId;
            if (lastAdmin) {
                const lastIdNumber = parseInt(lastAdmin.id.slice(1)); // Extract numeric part of the ID
                lastId = "A" + ("000" + (lastIdNumber + 1)).slice(-3); // Increment and format the new ID
            } else {
                lastId = "A001"; // If no existing records, start with S001
            }
            res.status(200).json({ id: lastId });
        } catch (error) {
            console.error("Error fetching last ID:", error);
            res.status(500).json({
                error: "Server Error: Unable to fetch last ID",
            });
        }
    }


}

module.exports = SuperAdminController;
