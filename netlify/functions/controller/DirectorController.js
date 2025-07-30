const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const AcademicDirectorModal=require('../model/DirectorModel');
const CampusModal=require('../model/CampusModel');

const secret='test';

const DirectorController = {

    /*academicDirectorSignUp: async (req,res)=>{

        const {directorId,name,mangedRoles,createdCourses,password}=req.body;

        try{
            const AcademicDirector= await AcademicDirectorModal.findOne({directorId});

            if (AcademicDirector) return res.status(400).json({message:"Academic Director already exists"});

            const hashedPassword=await bcrypt.hash(password,12);

            const result=await AcademicDirectorModal.create({directorId,name,mangedRoles,createdCourses,password:hashedPassword});

            const token = jwt.sign( { directorId: result.directorId, id: result._id }, secret, { expiresIn: "1h" } );

            res.status(200).json({result,token});

        }catch (error){
            res.status(500).json({message:'Something went wrong'});
            console.log(error);
        }
    }*/
    academicDirectorCreate: async (req, res) => {
        const { directorId, name, managedRoles, createdCourses, campus, password } = req.body;

        try {
            const existingDirector = await AcademicDirectorModal.findOne({ directorId });

            if (existingDirector) {
                return res.status(400).json({ message: "Academic Director already exists" });
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const newDirector = new AcademicDirectorModal({
                directorId,
                name,
                managedRoles,
                createdCourses,
                campus,
                password: hashedPassword
            });

            const result = await newDirector.save();

            const token = jwt.sign(
                { directorId: result.directorId, id: result._id },
                secret,
                { expiresIn: "1h" }
            );

            res.status(200).json({ result, token });

        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' });
            console.error(error);
        }

    },

    academicDirectorSignIn: async (req, res) => {
        const {name, password} = req.body;

        try{

            const academicDirector = await AcademicDirectorModal.findOne({name});

            if (!academicDirector) return res.status(404).json({message:"Academic Director doesn't exist"});

            const isPasswordCorrect=await bcrypt.compare(password,academicDirector.password);

            if (!isPasswordCorrect) return res.status(400).json({message:"Invalid credentials"});

            const token=jwt.sign({name:academicDirector.name,id:academicDirector._id},secret,{expiresIn:"1h"});

            res.status(200).json({result:academicDirector,token});

            console.log(academicDirector,token);


        }catch (error) {
            res.status(500).json({message: 'Something went wrong'});
            console.log(error);
        }
    },


    /*academicDirectorUpdate: async (req, res) => {
        /!*const { directorId } = req.params;
        const { name, managedRoles, createdCourses, campusName, password, newDirectorId } = req.body;

        try {
            // Find the existing academic director by directorId
            const existingDirector = await AcademicDirectorModal.findOne({ directorId });

            if (!existingDirector) {
                return res.status(404).json({ message: "Academic Director not found" });
            }

            // Check if the newDirectorId is unique
            if (newDirectorId && newDirectorId !== existingDirector.directorId) {
                const directorIdExists = await AcademicDirectorModal.findOne({ directorId: newDirectorId });
                if (directorIdExists) {
                    return res.status(400).json({ message: "New Director ID already in use" });
                }
                existingDirector.directorId = newDirectorId;
            }

            // Update other fields
            if (name) existingDirector.name = name;
            if (Array.isArray(managedRoles)) existingDirector.managedRoles = managedRoles;
            if (Array.isArray(createdCourses)) existingDirector.createdCourses = createdCourses;

            // Update campusName by finding the corresponding Campus document
            if (campusName) {
                const campus = await CampusModal.findOne({ campusName });  // Search campus by name
                if (!campus) {
                    return res.status(404).json({ message: "Campus not found" });
                }
                existingDirector.campusName = campus._id;  // Set the campus reference by ObjectId
            }

            // Hash the new password if provided
            if (password) {
                existingDirector.password = await bcrypt.hash(password, 12);
            }

            // Save the updated director document
            const updatedDirector = await existingDirector.save();

            // Generate a new token
            const token = jwt.sign(
                { directorId: updatedDirector.directorId, id: updatedDirector._id },
                secret,
                { expiresIn: "1h" }
            );

            res.status(200).json({ result: updatedDirector, token });

        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' });
            console.error(error);
        }*!/
        const { directorId } = req.params;
        const { name, managedRoles, createdCourses, campusName, password, newDirectorId } = req.body;

        try {
            // Find the existing academic director by directorId
            const existingDirector = await AcademicDirectorModal.findOne({ directorId });

            if (!existingDirector) {
                return res.status(404).json({ message: "Academic Director not found" });
            }

            // Check if the newDirectorId is unique
            if (newDirectorId && newDirectorId !== existingDirector.directorId) {
                const directorIdExists = await AcademicDirectorModal.findOne({ directorId: newDirectorId });
                if (directorIdExists) {
                    return res.status(400).json({ message: "New Director ID already in use" });
                }
                existingDirector.directorId = newDirectorId;
            }

            // Update other fields
            if (name) existingDirector.name = name;
            if (Array.isArray(managedRoles)) existingDirector.managedRoles = managedRoles;
            if (Array.isArray(createdCourses)) existingDirector.createdCourses = createdCourses;

            // Update campusName by finding the corresponding Campus documents
            if (Array.isArray(campusName)) {
                const campuses = await CampusModal.find({ campusName: { $in: campusName } });  // Find campuses by names
                if (campuses.length !== campusName.length) {
                    return res.status(404).json({ message: "One or more campuses not found" });
                }
                const campusIds = campuses.map(campus => campus._id);  // Get the _id of each campus
                existingDirector.campusName = campusIds;  // Set the campus reference by ObjectId array
            }

            // Hash the new password if provided
            if (password) {
                existingDirector.password = await bcrypt.hash(password, 12);
            }

            // Save the updated director document
            const updatedDirector = await existingDirector.save();

            // Generate a new token
            const token = jwt.sign(
                { directorId: updatedDirector.directorId, id: updatedDirector._id },
                secret,
                { expiresIn: "1h" }
            );

            res.status(200).json({ result: updatedDirector, token });

        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' });
            console.error(error);
        }
    }*/

    academicDirectorUpdate: async (req, res) => {
        const { directorId } = req.params;
        const { name, managedRoles, createdCourses, campusName, password, newDirectorId } = req.body;

        try {
            // Find the existing academic director by directorId
            const existingDirector = await AcademicDirectorModal.findOne({ directorId });

            if (!existingDirector) {
                return res.status(404).json({ message: "Academic Director not found" });
            }

            // Check if the newDirectorId is unique
            if (newDirectorId && newDirectorId !== existingDirector.directorId) {
                const directorIdExists = await AcademicDirectorModal.findOne({ directorId: newDirectorId });
                if (directorIdExists) {
                    return res.status(400).json({ message: "New Director ID already in use" });
                }
                existingDirector.directorId = newDirectorId;
            }

            // Update other fields
            if (name) existingDirector.name = name;
            if (Array.isArray(managedRoles)) existingDirector.managedRoles = managedRoles;
            if (Array.isArray(createdCourses)) existingDirector.createdCourses = createdCourses;

            // Update campusName by finding corresponding Campus documents
            if (Array.isArray(campusName)) {
                const campuses = await CampusModal.find({ campusName: { $in: campusName } }); // Find campuses by names

                if (campuses.length !== campusName.length) {
                    return res.status(404).json({ message: "One or more campuses not found" });
                }

                const campusIds = campuses.map(campus => campus._id); // Extract _id values of campuses
                existingDirector.campusName = campusIds; // Update director's campusName with ObjectIds
            }

            // Hash the new password if provided
            if (password) {
                existingDirector.password = await bcrypt.hash(password, 12);
            }

            // Save the updated director document
            const updatedDirector = await existingDirector.save();

            // Generate a new token
            const token = jwt.sign(
                { directorId: updatedDirector.directorId, id: updatedDirector._id },
                secret,
                { expiresIn: "1h" }
            );

            res.status(200).json({ result: updatedDirector, token });

        } catch (error) {
            res.status(500).json({ message: 'Something went wrong' });
            console.error(error);
        }
    }


}

module.exports=DirectorController;
