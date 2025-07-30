var express = require('express');
var router = express.Router();

const AcademicManagerController = require('../controller/AcademicManagerController');

router.get('/', function(req, res, next) {
   res.send('respond with a AcademicManager');
});


router.post('/create', AcademicManagerController.academicManagerCreate);

router.post('/signIn', AcademicManagerController.academicManagerLogin);

router.get('/getAll', AcademicManagerController.getAllAcademicManagers);

// router.put('/updateManager/:managerId', AcademicManagerController.updateAcademicManager);

module.exports = router;