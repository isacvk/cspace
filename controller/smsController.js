const fast2sms = require("fast-two-sms");

exports.sendSMS = async (message, phoneNum) => {
  if (process.env.NODE_ENV === "production") {
    console.log(process.env.F2SMS_KEY);
    let response = await fast2sms.sendMessage({
      authorization: `${process.env.F2SMS_KEY}`,
      message: message,
      numbers: phoneNum,
    });

    console.log("API Response", response);
    return response;
  }
};
