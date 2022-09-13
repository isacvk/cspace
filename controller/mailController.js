const fs = require('fs');

const mail = require('nodemailer');
const multer = require('multer');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'mail');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, file.originalname);
    req.mailattach = `mail/${file.originalname}`;
  },
});

const multerFilter = (req, file, cb) => {
  const ext = file.mimetype.split('/')[1];
  if (ext === 'jpeg' || ext === 'jpg' || ext === 'pdf' || ext === 'png') {
    cb(null, true);
  } else {
    cb(new AppError('Only jpeg, jpg and pdf can be uploaded', 400));
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadAttachment = upload.single('attachment');

const transporter = mail.createTransport({
  service: 'hotmail',
  auth: {
    user: 'isac.vk@outlook.com',
    pass: '1sa3Vk@Outlook',
  },
});

exports.sendMail = catchAsync(async (req, res, next) => {
  // TODO: GET MAIL ID USING USERID, FAMILY ID/WARD AND SEND MAIL
  const mailOptions = {
    from: 'isac.vk@outlook.com',
    to: 'jestin9900767795@gmail.com',
    subject: `${req.body.subject}`,
    text: `${req.body.text}`,
    attachments: [
      {
        path: req.mailattach,
      },
    ],
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log('ERR IN MAIL SENDING : ', err);
    } else {
      fs.unlink(req.mailattach, (error) => {
        if (error) {
          console.log('ERR IN FILE DELETION : ', error);
        }
      });
      console.log('Message send : ', info.response);
      if (info.response.split(' ')[2] === 'OK') {
        res.status(200).json({
          status: 'success',
          message: 'mail sent successfully!',
        });
      } else {
        res.status(503).json({
          status: 'error',
          message: 'mail service is having some issue! Try after some time.',
        });
      }
    }
  });
});
