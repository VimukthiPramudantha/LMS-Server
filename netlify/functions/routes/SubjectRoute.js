var express = require('express');
var router = express.Router();

const SubjectController = require('../controller/SubjectController');

// Default route for testing
router.get('/', function(req, res, next) {
    res.send('Subject endpoint is working!');
});

// Route to create a new subject
router.post('/create', SubjectController.subjectCreate);

// Route to get all subjects
router.get('/getAllSubjects', SubjectController.getAllSubjects);

// Route to get all subjects without limit
router.get('/getAllSubjectsNoLimit', SubjectController.getAllSubjectsNoLimit);

// Route to get a subject by ID
router.get('/getSubjectById/:id', SubjectController.getSubjectById);

// Route to update a subject by ID
router.put('/updateSubject/:id', SubjectController.subjectUpdate);

module.exports = router;
