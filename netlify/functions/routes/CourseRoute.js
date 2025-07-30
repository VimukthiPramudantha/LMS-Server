var express=require('express');
var router=express.Router();

const CourseController=require('../controller/CourseController');

router.post('/create',CourseController.courseCreate);

router.get('/getAllCourses',CourseController.getAllCourse);

router.put('/updateCourse/:id',CourseController.courseUpdate);

router.get('/getCoursesByCampus/:campusId', CourseController.getCoursesByCampus);
module.exports=router;
