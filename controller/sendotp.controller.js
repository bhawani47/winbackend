// const t_sid = 'AC110f53d101600e84ea941bc465844ea9';
// const t_token = 'b578a8b98de6bd7aa13b6bc3b3d8378a';
const { RegisterModel } = require("../model/model");
const client = require('twilio')(process.env.TWILLIO_SID,process.env.TWILLIO_TOKEN);
// (process.env.TWILLIO_SID,process.env.TWILLIO_TOKEN)

const sendOtp = async (req, res, next) => {

  function generateOTP() {
    let digits = "5123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return parseInt(OTP);
  }

  req.body.time = new Date().getTime();
  req.body.otp = generateOTP();
  const userData = await RegisterModel.findOne({ mobile: req.body.mobile });
  if (userData) {
    if (userData.isV) {
      res.json({message:'USER_EXIST'});
    } else {
      const t = new Date().getTime();
      const diff = t - userData.time;

      if (diff / 1000 > 60) {
        const regUser = await RegisterModel.updateOne(
          { mobile: req.body.mobile },
          { time: req.body.time, otp: req.body.otp,OtpTried:0 }
        );

        if (regUser.modifiedCount === 1) {
        client.messages .create({ 
        body: `Your varification code is ${req.body.otp}`,  
        messagingServiceSid: 'MGff98014408167a893cf4c70b4f32287e',      
        to: `+91${req.body.mobile}`
         });
        }
        res.json({ message: "OTP_SENT" });
      } else {
        res.json({ message: "TIME_ERROR" });
      }
    }
  } else {
    const data = RegisterModel(req.body);
    await data.save();
    //call send sms api here only !
    client.messages .create({ 
      body: `Your varification code is ${req.body.otp}`,  
      messagingServiceSid: 'MGff98014408167a893cf4c70b4f32287e',      
      to: `+91${req.body.mobile}`
       });

    res.json({ message: "OTP_SENT" });
  }
};

module.exports = { sendOtp };
