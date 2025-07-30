var express=require('express');
var router=express.Router();

const AcademicDirectorController=require('../controller/DirectorController');
router.get('/', function(req, res, next) {
   res.send('respond with a fsdfresource');
 });
router.post('/create',AcademicDirectorController.academicDirectorCreate);

router.post('/signIn',AcademicDirectorController.academicDirectorSignIn);

router.put('/updateDirector/:directorId',AcademicDirectorController.academicDirectorUpdate);


module.exports=router;
