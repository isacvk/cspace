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
const chartRouter = require('./routes/chartRoutes');

const digitalSign = require('./controller/signController');
const cronController = require('./controller/cronController');

const app = express();

app.use(cookieParser());

app.use(express.json());

// CORS Functionalities
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE');
    return res.status(200).json({});
  }
  next();
});

schedule.scheduleJob('1 0 * * *', () => {
  // THIS WORKS AT 12:01AM EVERYDAY
  cronController.generateBdayList();
  cronController.generateMarriageAnniversayList();
  cronController.clearSponsorTable();
  cronController.clearexpiredOfferings();
});

schedule.scheduleJob('*/5 * * * *', () => {
  // THIS WORKS EVERY 5 MINS
  console.log('5 min scheduler running');

  cronController.clearexpiredOfferings();
  cronController.generateBdayList();
  cronController.generateMarriageAnniversayList();
  cronController.clearexpiredOfferings();
});

schedule.scheduleJob('*/7 * * * *', () => {
  // THIS WORKS EVERY 2 MINS
  console.log('7 min scheduler running');
  cronController.createBdayCsv();
  cronController.createAnniversaryCsv();
});

// app.use((req, res, next) => {
//   for (const key in req.body) {
//     if (typeof req.body[key] === 'object') {
//       for (const innerKey in req.body[key]) {
//         if (typeof req.body[key][innerKey] === 'string') {
//           req.body[key][innerKey] = req.body[key][innerKey].toLowerCase();
//         }
//       }
//     } else if (typeof req.body[key] === 'string') {
//       req.body[key] = req.body[key].toLowerCase();
//     }
//   }
//   console.log(req.body);
//   next();
// });

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
app.use('/api/v1/chart', chartRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
