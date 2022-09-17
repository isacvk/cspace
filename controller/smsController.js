const fast2sms = require('fast-two-sms');

exports.sendSMS = async (message, phoneNum) => {
  let response;
  // ***! Change to "production" later
  console.log('Message Called : ', message, phoneNum);
  if (process.env.NODE_ENV === 'development') {
    response = await fast2sms.sendMessage({
      authorization: `${process.env.F2SMS_KEY}`,
      message: message,
      numbers: phoneNum,
    });

    // console.log("RES : ", response);
    return response;
  }
};
