var express=require('express');
var router=express.Router();

const ITExicutiveController=require('../controller/ITExicutiveController');

router.get('/', function(req, res, next) {
   res.send('respond with a ITExicutiveControlleraads');
 });

router.post('/signIn',ITExicutiveController.createITExecutive);
// Route to get all IT Executives
router.get('/getall', ITExicutiveController.getAllITExecutives);

// Update IT Executive by ID
router.put('/updateITExecutive/:id', ITExicutiveController.updateITExecutive);

// Login IT Executive
router.post('/login', ITExicutiveController.loginITExecutive);

module.exports=router;
