const { where } = require("sequelize");
const database = require("../../config/database_config");
const {successResponse, failureResponse} = require("../../src/utilities/utilities");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");


const createVendorApi = async (req, res) => {
   try {

    console.log("req isssssssssss", req);

    const { mobile_number, email_id, vendor_name, password } = req.body;

   /* const mobile_number  = req.body.mobile_number;
    const email_id  = req.body.email_id;
    const vendor_name  = req.body.vendor_name;
    const password  = req.body.password; */

    console.log("req.body issssssssssssss",req.body);

    const isVendorAvailable = await database.models.vendor_model.findOne({
        where : {
            mobile_number : mobile_number
        }
    });

     console.log("------------isVendorAvailable", isVendorAvailable);

    if(! mobile_number) {
        return res.status(400).json(failureResponse("failure", "please provide valid mobile number"))
    }
 
   else if(!vendor_name) {
        return res.status(400).json(failureResponse("failure", "please provide valid vendor name"))
    }

    else if(!password) {
        return res.status(400).json(failureResponse("failure", "please provide valid password"))
    }

    else if(isVendorAvailable !== null){
        return res.status(400).json(failureResponse("failure", "Already vendor is registerd , do login "))
 
    }

    else {
      const hashedPassword = await bcrypt.hash(password,10);

      const vendor_data = await database.models.vendor_model.create({
        mobile_number, vendor_name, password : hashedPassword
      });

      return res.status(201).json({
        status : "success",
        message : "successfully vendor is registered",
        code : vendor_data
     })
    }
     
   }catch(error) {
    console.log("error is -----------", error);
    res.status(500).json({
        status : "failure",
        message : "something interbal server error",
        code : error
    })
   }
}

const getAllVendors = async (req, res) => {
    try{
      const vendorsData = await database.models.vendor_model.findAll();
      res.status(200).json(successResponse("success", "found all vendors data", vendorsData));

    }catch(errro) {
        res.status(500).json(failureResponse("failure", "not able to find all vendors data"))
    }
}

const getVendorByMObileNumber = async (req, res) => {
    try{
        const mobile_number = req.params.mobile_number;
      const vendorsData = await database.models.vendor_model.findOne({
        where : {
            mobile_number : mobile_number
        }
      });

      if(!mobile_number){
        return res.status(400).json(failureResponse("faiure", "please provide valid mobile number"));

      }
      else if(mobile_number !== vendorsData.mobile_number) {
        return res.status(400).json(failureResponse("faiure", "please provide valid vendor mobile number"));

      }
      console.log(`vendors DATA--------- ${vendorsData}`)
      res.status(200).json(successResponse("success", "found  vendors data successfully", vendorsData));

    }catch(errro) {
        res.status(500).json(failureResponse("failure", "not able to find all vendors data"))
    }
}

const updateVendorByMobileNumber = async (req, res) => {
    try{
        const mobile_number = req.params.mobile_number;
        const vendor_name = req.body.vendor_name;
      const vendorsData = await database.models.vendor_model.update({
           vendor_name : vendor_name
      },{
        where : {
            mobile_number : mobile_number
        }
      });
      res.status(200).json(successResponse("success", "update  vendors data successfully", vendorsData));

    }catch(errro) {
        res.status(500).json(failureResponse("failure", "not able to update vendors data"))
    }
}

const deleteVendorByMobileNumber = async (req, res) => {
    try{
        const mobile_number = req.params.mobile_number;
        
      const vendorsData = await database.models.vendor_model.destroy({

        where : {
            mobile_number : mobile_number
        }
      });
      res.status(200).json(successResponse("success", "delete  vendors data successfully", vendorsData));

    }catch(errro) {
        res.status(500).json(failureResponse("failure", "not able to delete vendors data"));

    }
}

const forgetPassword_otpSendApi = async (req,res) => {
  try {
     const mobile_number = req.body.mobile_number;

     if(!mobile_number) {
      return res.status(400).json(failureResponse("failure", "please provide valid mobile number"));
     }

     else {
      function otpGenerate() {
        let otp = "";
        const otp_length = 6;
        for(let i=0; i<otp_length; i++) {
          otp += Math.floor(Math.random() * 10)
        }

        return otp;
      }

      let otp = otpGenerate();
      console.log("otp is=======", otp);

      // update otp in exix=sting mobile number
      const isOtpData = await database.models.otp_model.update({otp},{
        where : {
          mobile_number : mobile_number
        }
      });

      // fetch otp from existing mobile number

      const updatedOtp = await database.models.otp_model.findOne({
        where : {
          mobile_number : mobile_number
        }
      })

      return res.status(200).json(successResponse("success", "otp send successfully ", updatedOtp))
     }
  }catch(error) {
  return res.status(500).json(failureResponse("failure", " something went wrong "))
  }
}

const verifyOTP_resetPasswordApi = async (req,res) => {
  try {
         const mobile_number = req.body.mobile_number;
         const otp = req.body.otp;
         const password = req.body.password;

         const isExistingOTP = await database.models.otp_model.findOne({
          where : {
            mobile_number : mobile_number
          }
         })

       if(!mobile_number) {
        return res.status(400).json(failureResponse("failure", "please provide valide mobile number"))
       }

       else if(!otp) {
        return res.status(400).json(failureResponse("failure", "please provide valide otp"));
     }
    
     else if(otp !== isExistingOTP.otp) {
      return res.status(400).json(failureResponse("failure", "please provide valide otp which sent to your mobile number"));

     }

     else if(!password) {
           return res.status(400).json(failureResponse("failure", "please provide valide password"));
 
     }

     else { 
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("hashed pasword is==================",hashedPassword);

      const upadated_pwdData = await database.models.vendor_model.update({password:hashedPassword},
        {
          where : {
            mobile_number: mobile_number
          }
        });

        await database.models.otp_model.update({otp : null }, {
          where : {
            mobile_number : mobile_number
          }
        });

        return res.status(201).json(successResponse("success", "reset the password successfully", upadated_pwdData))



     }
  }catch(error) {
    console.log("errro================", error);
    return res.status(201).json(failureResponse("failure", "something went wrong", error))

  }
}



module.exports = {createVendorApi, getAllVendors, getVendorByMObileNumber,updateVendorByMobileNumber, deleteVendorByMobileNumber,
                forgetPassword_otpSendApi, verifyOTP_resetPasswordApi
 }