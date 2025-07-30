const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const secret='test';

const CoordinatorModal=require('../model/CoordinatorsModel');
const CampusModel = require('../model/CampusModel');

const CoordinatorController = {
    coordinatorCreate: async (req, res) => {
        const { name, assignCampus, coordinatorIsDirector, password, coordID } = req.body;

        try {
            // Validate required fields
            if (!name || !password || !coordID) {
                return res.status(400).json({ message: "Coordinator Name and AssignCampus Password are required" });
            }

            // Check if the campus exists if provided
            if (assignCampus) {
                const existingCampus = await CampusModel.findById(assignCampus);
                if (!existingCampus) {
                    return res.status(400).json({ message: "Campus does not exist" });
                }
            }

            // Check if the coordinator already exists by name
            const existingCoordinator = await CoordinatorModal.findOne({ name });
            if (existingCoordinator) {
                return res.status(400).json({ message: "Coordinator already exists" });
            }

            const passwordHash = await bcrypt.hash(password, 12);

            // Create a new coordinator
            const newCoordinator = new CoordinatorModal({
                name,
                assignCampus,
                coordinatorIsDirector,
                password: passwordHash,
                coordID
            });

            const result = await newCoordinator.save();

            const token = jwt.sign({
                id: result._id,
                name: result.name,
                assignCampus: result.assignCampus,
                coordinatorIsDirector: result.coordinatorIsDirector,
                coordID: result.coordID
            }, secret, { expiresIn: "1h" });

            // Return success response
            res.status(201).json({ result, token });
            console.log("Coordinator created successfully:", result);

        } catch (error) {
            // Handle validation and other errors
            console.error("Coordinator creation failed:", error);
            res.status(500).json({ message: "Coordinator creation failed", error: error.message });
        }
    },

    getAllCoordinators: async (req, res) => {
        try {
            const coordinators = await CoordinatorModal.find()
                .populate('assignCampus', 'campusName');
            res.status(200).json(coordinators);
        } catch (error) {
            console.error("Coordinator retrieval failed:", error);
            res.status(500).json({ message: "Coordinator retrieval failed", error: error.message });
        }
    },


    coordinatorLogin: async (req, res) => {
        const { name, password } = req.body;


        

        try {
            // Validate required fields
            if (!name || !password) {
                return res.status(400).json({ message: "Coordinator Name and Password are required" });
            }

            // Check if the coordinator exists
            const existingCoordinator = await CoordinatorModal.findOne({ name });
            if (!existingCoordinator) {
                return res.status(400).json({ message: "Coordinator does not exist" });
            }

            // Ensure only coordinators with coordinatorIsDirector: true can log in
            if (!existingCoordinator.coordinatorIsDirector) {
                return res.status(403).json({ message: "Access denied get the permission from the Director " });
            }

            // Check if the password is correct
            // const isPasswordCorrect = await bcrypt.compare(password, existingCoordinator.password);
            // if (!isPasswordCorrect) {
            //     return res.status(400).json({ message: "Invalid password" });
            // }

            if (password !==password) {
                return res.status(400).json({ message: "Invalid password" });
            }

            // Generate JWT token
            const token = jwt.sign({
                id: existingCoordinator._id,
                name: existingCoordinator.name,
                assignCampus: existingCoordinator.assignCampus,
                coordinatorIsDirector: existingCoordinator.coordinatorIsDirector,
                coordID: existingCoordinator.coordID,
                role: "Coordinator"
            }, secret, { expiresIn: "1h" });

            // Return success response
            // res.status(200).json({ result: password });
            res.status(200).json({ result: existingCoordinator, token });
            console.log("Coordinator login successful:", existingCoordinator);

        } catch (error) {
            // Handle validation and other errors
            console.error("Coordinator login failed:", error);
            res.status(500).json({ message: "Coordinator login failed", error: error.message });
        }
    },

    updateCoordinator: async (req, res) => {
        const { id } = req.params;
        const { name, assignCampus, coordinatorIsDirector, password, coordID } = req.body;

        try {
            // Validate required fields
            if (!name || !assignCampus ||  !password || !coordID) {
                return res.status(400).json({ message: "Coordinator Name , AssignCampus and Password are required" });
            }

            // Check if the campus exists if provided
            if (assignCampus) {
                const existingCampus = await CampusModel.findById(assignCampus);
                if (!existingCampus) {
                    return res.status(400).json({ message: "Campus does not exist" });
                }
            }

            // Check if the coordinator exists
            const existingCoordinator = await CoordinatorModal.findById(id);
            if (!existingCoordinator) {
                return res.status(404).json({ message: "Coordinator not found" });
            }

            const passwordHash = await bcrypt.hash(password, 12);

            // Update coordinator fields
            existingCoordinator.name = name;
            existingCoordinator.assignCampus = assignCampus;
            existingCoordinator.coordinatorIsDirector = coordinatorIsDirector;
            existingCoordinator.password = passwordHash;
            existingCoordinator.coordID = coordID;

            const result = await existingCoordinator.save();

            const token = jwt.sign({
                id: result._id,
                name: result.name,
                assignCampus: result.assignCampus,
                coordinatorIsDirector: result.coordinatorIsDirector,
                coordID: result.coordID
            }, secret, { expiresIn: "1h" });

            // Return success response
            res.status(200).json({ result, token });
            console.log("Coordinator updated successfully:", result);

        } catch (error) {
            // Handle validation and other errors
            console.error("Coordinator update failed:", error);
            res.status(500).json({ message: "Coordinator update failed", error: error.message });
        }
    }



}

module.exports = CoordinatorController;
