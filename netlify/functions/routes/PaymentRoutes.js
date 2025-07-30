var express=require('express');
var router=express.Router();


const PaymentController=require('../controller/PaymentPlanController');

router.get('/', function(req, res, next) {

   res.send('respond with a Payment');
 });
router.post('/create',PaymentController.paymentPlanCreate);

router.get('/getAllPaymentPlans',PaymentController.getAllPaymentPlans);

router.put('/update/:id',PaymentController.updatePaymentPlan);

router.get('/getPaymentPlanByCourse/:courseId', PaymentController.getPaymentPlanByCourse);

router.get('/getPaymentPlansByCampus/:campusId',PaymentController.getPaymentPlansByCampus);

module.exports=router;
