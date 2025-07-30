var express=require('express');
var router=express.Router();

const superAdminController=require('../controller/SuperAdminController');

router.post('/CreateAdmin',superAdminController.superAdminCreate);

router.post('/addDirector',superAdminController.addDirector);

router.post('/signInAdmin',superAdminController.superAdminSignIn);

router.get('/allDirectors',superAdminController.getAllDirectors);

router.get('/getLastId',superAdminController.dataBaseLastIdCheckDirector);

module.exports=router;

