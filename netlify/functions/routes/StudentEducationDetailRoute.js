var express=require('express');
var router=express.Router();

const StudentEducationDetailController=require("../controller/StudentEducationDetailController");

router.post('/addEducationDetails',StudentEducationDetailController.addEducationDetails);

router.get('/getEducationController',StudentEducationDetailController.getEducation);


module.exports=router;
