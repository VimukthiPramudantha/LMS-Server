var express=require('express');
var router=express.Router();

const CoordinatorController=require('../controller/CoordinatorController');

router.get('/', function(req, res, next) {

   res.send('respond with CoordinatorController');
 });
 
router.post('/create',CoordinatorController.coordinatorCreate);

router.get('/getAllCoordinators',CoordinatorController.getAllCoordinators);

router.post('/login',CoordinatorController.coordinatorLogin);

router.put('/updateCoordinator/:id',CoordinatorController.updateCoordinator);

module.exports=router;
