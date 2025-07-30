var express = require('express');
var router = express.Router();


const StudentDetailsController=require('../controller/StudentDetailsController');

router.get('/', function(req, res, next) {

   res.send('sttudent details route');
 });

router.post('/addStudentDetails',StudentDetailsController.addStudentDetails);

router.post('/addStudentJoinclass',StudentDetailsController.addStudentJoinClass);

router.get('/getAllStudentDetails',StudentDetailsController.getAllStudentDetails);


module.exports = router;
