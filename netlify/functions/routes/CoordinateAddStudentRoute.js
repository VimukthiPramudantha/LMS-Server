var express=require('express');
var router=express.Router();

const CoordinatorAddStudentController=require('../controller/CoordinatorsAddStudentController');

router.get('/', function(req, res, next) {

   res.send('respond with ontroccller');
 });

// router.post('/addStudentInstallent',CoordinatorAddStudentController.addStudentPayInstallent);

router.post('/addStudent',CoordinatorAddStudentController.addStudent);
router.get('/getStudentbycourse/:id', CoordinatorAddStudentController.getStudentByCourse);

router.get('/getAllStudents',CoordinatorAddStudentController.getAllStudents);

router.post('/LoginStudent',CoordinatorAddStudentController.getLoginStudent);

router.put('/updateStudent/:id',CoordinatorAddStudentController.updateStudent);
router.put('/updateStudentDetails/:id',CoordinatorAddStudentController.updateStudentDetails);
router.patch('/updateInstallments/:id',CoordinatorAddStudentController.updateInstallments);
router.put('/updatePaymentHis/:id',CoordinatorAddStudentController.updatePaymentHistory);
router.put('/:id/image',CoordinatorAddStudentController.handleUpdateStudentImage);

// router.patch('/updatePaymentHistory/:id',CoordinatorAddStudentController.updatePaymentHistory);
// In your routes file
router.put(
  '/updatePaymentHistory/:id',
  CoordinatorAddStudentController.updatePaymentStatus
);

router.get('/getStudent/:id',CoordinatorAddStudentController.getStudent);

// router.post('/uploadPaymentSlip',CoordinatorAddStudentController.uploadPaymentSlip);

// In your backend route handler
router.patch('/updateInstallments/:id', async (req, res) => {
  try {
    const { Installments, PaymentHistory } = req.body;
    
    // Find existing payment history to check for duplicates
    const existingStudent = await CoordinateAddStudent.findById(req.params.id);
    const existingPaymentHistory = existingStudent.PaymentHistory || [];
    
    // Filter out duplicates by payment reference number
    const newPaymentHistory = PaymentHistory.filter(newPayment => 
      !existingPaymentHistory.some(existingPayment => 
        existingPayment.PayHisSlipReference === newPayment.PayHisSlipReference
      )
    );
    
    const updatedStudent = await CoordinateAddStudent.findByIdAndUpdate(
      req.params.id,
      {
        $set: { Installments },
        $addToSet: { 
          PaymentHistory: { 
            $each: newPaymentHistory 
          } 
        }
      },
      { new: true }
    );
    
    res.json(updatedStudent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});




module.exports=router;
