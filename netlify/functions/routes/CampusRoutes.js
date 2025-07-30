var express=require('express');
var router=express.Router();

const CampusController=require('../controller/CampusController');


router.get('/', function(req, res, next) {

   res.send('respond with campus');
 });
router.post('/create',CampusController.campusCreate);

router.get('/getAllCampuses',CampusController.getAllCampuses);

router.put('/updateCampus/:id',CampusController.campusUpdate);

router.get('/getCampusById/:id',CampusController.getCampusById);


module.exports=router;
