var express=require('express');
var router=express.Router();

const StudentWorkController=require("../controller/StudentWorkController");

router.post('/create',StudentWorkController.addWorkPlace);

router.get('/getWorkController',StudentWorkController.getWorkPlace);


module.exports=router;
