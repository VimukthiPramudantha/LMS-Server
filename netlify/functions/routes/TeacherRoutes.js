var express=require('express');
var router=express.Router();

const TeacherController=require('../controller/TeacherController');

router.get('/', function(req, res, next) {
   
   res.send('respond with TeacherController');
 });

router.post('/create',TeacherController.createTeacher);

router.get('/getAllTeachers',TeacherController.getAllTeachers);

// router.get('/getTeacherById/:id',TeacherController.getTeacherById);

router.put('/updateTeacher/:id',TeacherController.updateTeacher);

router.delete('/deleteTeacher/:id',TeacherController.deleteTeacher);

router.post('/login',TeacherController.loginTeacher);



module.exports=router;
