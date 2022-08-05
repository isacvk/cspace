const fast2sms = require("fast-two-sms");

exports.sendSMS = async (message, phoneNum) => {
  if (process.env.NODE_ENV === "production") {
    let response = await fast2sms.sendMessage({
      authorization: `${process.env.F2SMS_KEY}`,
      message: message,
      numbers: phoneNum,
    });
    return response;
  }
};
