const path = require('path');

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const schedule = require('node-schedule');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controller/errorController');

const familyRouter = require('./routes/familyRoutes');
const personRouter = require('./routes/personRoutes');
const userRouter = require('./routes/userRoutes');
const registryRouter = require('./routes/registryRoutes');
const announceRouter = require('./routes/announceRoutes');
const smsRouter = require('./routes/smsRoutes');
const mailRouter = require('./routes/mailRoutes');
const pdfRouter = require('./routes/pdfRoutes');
const paymentRouter = require('./routes/paymentRoutes');
const offeringsRouter = require('./routes/offeringsRoutes');
const accountsRouter = require('./routes/accountsRoutes');

const digitalSign = require('./controller/signController');
const cronController = require('./controller/cronController');

const app = express();

app.use(cookieParser());

app.use(express.json());

// CORS Functionalities
// app.use(cors({ origin: true, credentials: true }));
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
// app.set("trust proxy", 1);

// app.options("*", cors());

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Testing
app.set('trust proxy', 1);

app.use((req, res, next) => {
  // res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.header('Access-Control-Allow-Credentials', true);
  // res.header(
  //   "Access-Control-Allow-Headers",
  //   "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  // );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE');
    return res.status(200).json({});
  }
  next();
});

// app.use((req, res, next) => {
//   console.log(req);
//   next();
// });

schedule.scheduleJob('0 0 * * *', () => {
  cronController.generateBdayList();
});

app.use('/api/v1/family', familyRouter);
app.use('/api/v1/persons', personRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/registry', registryRouter);
app.use('/api/v1/announce', announceRouter);
app.use('/api/v1/send-sms', smsRouter);
app.use('/api/v1/send-mail', mailRouter);
app.use('/api/v1/create-pdf', pdfRouter);
app.use('/api/v1/verify-sign', digitalSign.verifySign);
app.use('/api/v1/payment', paymentRouter);
app.use('/api/v1/offerings', offeringsRouter);
app.use('/api/v1/accounts', accountsRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
