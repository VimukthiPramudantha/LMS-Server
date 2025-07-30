const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');
const cors = require('cors');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
const router = express.Router();



// Middleware setup
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS configuration
app.use(cors());
app.options('*', cors());

// Route definitions
const indexRouter = require('./routes');
const usersRouter = require('./routes/users');
const academicDirectorRouter = require('./routes/DirectorRoutes');
const superAdminRouter = require('./routes/SuperAdminRoutes');
const campusRouter = require('./routes/CampusRoutes');
const courseRouter = require('./routes/CourseRoute');
const subjectRouter = require('./routes/SubjectRoute');
const coordinatorRouter = require('./routes/CoordinatorRoutes');
const paymentRouter = require('./routes/PaymentRoutes');
const coordinatorAddStudentRoute = require('./routes/CoordinateAddStudentRoute');
const studentDetailsRoute = require('./routes/StudentDetailsRoute');
const StudentEducationDetailRoute = require('./routes/StudentEducationDetailRoute');
const itExicutive = require('./routes/ITExicutiveRoute');
const teacherRouter = require('./routes/TeacherRoutes');
const zoomRoutes = require('./routes/zoomRoutes');
const academicManagerRoutes = require("./routes/AcademicManagerRoute");
const accountantRoutes =require('./routes/AccountRoutes');
const accountantHeadRoutes =require('./routes/AccountHeadRoutes');


const mongoose = require("mongoose");

// Define routes
router.use('/', indexRouter);
router.use('/users', usersRouter);
router.use('/academicDirector', academicDirectorRouter);
router.use('/superAdmin', superAdminRouter);
router.use('/campus', campusRouter);
router.use('/course', courseRouter);
router.use('/subject', subjectRouter);
router.use('/coordinator', coordinatorRouter);
router.use('/payment', paymentRouter);
router.use('/coordinatorAddStudent', coordinatorAddStudentRoute);
router.use('/studentDetails', studentDetailsRoute);
router.use('/StudentEducationDetailRoute', StudentEducationDetailRoute);
router.use('/itExicutive', itExicutive);
router.use('/teacher', teacherRouter);
router.use('/zoom', zoomRoutes);
router.use('/academicManager', academicManagerRoutes);
router.use('/accountant',accountantRoutes);
router.use('/accountanthead',accountantHeadRoutes);




const CONNECTION_URL = 'mongodb+srv://intellectsoftdb2lms:Z0Vf2thutzdhvhPY@students.6l4qz.mongodb.net/?retryWrites=true&w=majority&appName=Students';
const PORT = process.env.PORT || 4000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
    .catch((error) => console.log(`${error} did not connect`));

// Test route
router.get('/test', (req, res) => res.status(200).json({ message: "Hello Test route" }));

// Apply routes to the app
app.use('/api', router);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  const errorResponse = {
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  };
  res.status(err.status || 500).json(errorResponse);
});

// Export handler for Netlify
module.exports.handler = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return serverless(app)(event, context);
};
