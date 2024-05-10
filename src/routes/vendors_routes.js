const express = require("express");
const router = express.Router();

const vendorController = require("../controllers/vendors_controller");

router.post("/createVendorApi", vendorController.createVendorApi);
router.get("/getAllVendors", vendorController.getAllVendors);
router.get("/getVendorByMObileNumber/:mobile_number", vendorController.getVendorByMObileNumber);
router.put("/updateVendorByMobileNumber/:mobile_number", vendorController.updateVendorByMobileNumber);
router.delete("/deleteVendorByMobileNumber/:mobile_number", vendorController.deleteVendorByMobileNumber);
router.post("/forgetPassword_otpSendApi", vendorController.forgetPassword_otpSendApi);
router.post("/verifyOTP_resetPasswordApi", vendorController.verifyOTP_resetPasswordApi);

module.exports = router;
