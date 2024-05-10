const express = require("express");
const router = express.Router();

const otpApiConroller = require("../controllers/otp_controller");

router.post("/sendOtpApi", otpApiConroller.sendOtpApi);
router.post("/otpverifyAPi", otpApiConroller.otpverifyAPi);
router.post("/otpSendByMail", otpApiConroller.otpSendByMail);
router.post("/otpVErifyByMail", otpApiConroller.otpVErifyByMail);



module.exports = router;