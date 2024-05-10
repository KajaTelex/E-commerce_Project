const { where } = require("sequelize");
const database = require("../../config/database_config");
const {successResponse, failureResponse} = require("../../src/utilities/utilities");
const nodemailer = require("nodemailer");

const sendOtpApi = async (req, res) => {
    const mobile_number = req.body.mobile_number;

  if(!mobile_number) {
    return  res.status(400).json(failureResponse("failure", "provide valid mobile number"));
 }

 else {

    function otpgenerate() {
      let otp = "";
      const otp_length = 6;

      for(let i=0; i<otp_length; i++ ) {
         otp += Math.floor(Math.random() * 10);
      }
      return otp;
    }

      const otp = otpgenerate();
      console.log("generated otp is------", otp);  

      const isDataExists = await database.models.otp_model.findOne({
        where : {
            mobile_number: mobile_number
        }
      });

      console.log("isDataExists-----------", isDataExists);

       if(isDataExists === null) {
          // create otp for new user

          const create_otp = await database.models.otp_model.create({mobile_number, otp});
          return res.status(201).json(successResponse("success", "otp send successfully", create_otp));
      }

      else {
         // update otp for existing user
         const update_otp = await database.models.otp_model.update({otp},{
            where : {
                mobile_number : mobile_number
            }
         });

         // to fetch updated otp from database
         
         const updated_otp_data = await database.models.otp_model.findOne({
            where : {
                mobile_number : mobile_number
            }
         })
            return res.status(200).json(successResponse("successfull", "otp updated succesfully", updated_otp_data));
      }
 }

}


const otpverifyAPi = async (req, res) => {
    try {
     const  mobile_number = req.body.mobile_number;
     const otp = req.body.otp;

     const isOtpDataAvailable = await database.models.otp_model.findOne({
      where : {
         mobile_number : mobile_number
      }
     });

     if(!mobile_number) {
      return res.status(400).json(failureResponse("failure", "please provide valid mobile number"));

     }

     else if(!otp) {
      return res.status(400).json(failureResponse("failure", "please provide valid otp"));

     }
     else if(otp !== isOtpDataAvailable.otp) {
      return res.status(400).json(failureResponse("failure", "please provide valid otp which you got in your mobile number"));
    }

    else {
       await database.models.otp_model.findOne({
         where : {
            mobile_number : mobile_number
         }
        });

        const isVerifyOtp = await database.models.otp_model.update({
         isVerified : true
        },{
         where : {
          mobile_number : mobile_number
         }
        });

         await database.models.otp_model.update({otp : null },
       {
         where : {
          mobile_number : mobile_number
         }
        });
     
     return res.status(200).json(successResponse("success", "otp verified successfully on existing mobile number",isOtpDataAvailable ))
    }
    }catch(error) {

    }
}


const otpSendByMail = async (req, res) => {
   try {
       const email_id = req.body.email_id;

       // Function to generate OTP
       function generateOTP() {
           let otp = "";
           const otp_length = 6;

           for (let i = 0; i < otp_length; i++) {
               otp += Math.floor(Math.random() * 10);
           }
           return otp;
       }

       const otp = generateOTP();
       console.log("otp is : -------", otp);

       const isDataExists = await database.models.otp_model.findOne({
         where : {
            email_id : email_id
         }
       })

       console.log("isDataExists----------", isDataExists);

       // set up SMTP transporter
       let transporter = nodemailer.createTransport({
           host: "smtp.gmail.com",
           port: 587,
           secure: false,
           auth: {
               user: "kajatelex@gmail.com",
               pass: "iigh gtie sffi jwld"
           }
       });

       //compose mail
       let mailOptions = {
           from: "kajatelex@gmail.com",
           to: email_id,
           subject: "E-com One Time Password",
           text: `Your E-com one tome password is ${otp}`
       }

       // send email
       const info = await transporter.sendMail(mailOptions);

       console.log("email sent : ", info.response);

       if(isDataExists === null) {
         // Store OTP in database u
       const otpData = await database.models.otp_model.create({
         email_id : email_id,
           otp: otp
       });

       console.log("OTP stored in database:", otpData);

       return res.status(200).json(successResponse("success","OTP sent and stored successfully", otpData ));

       }

       else {
         const update_otp = await database.models.otp_model.update({otp}, {
            where : {
               email_id : email_id
            }
         });

         // fetch otp from database 
        const updated_otp_data=  await database.models.otp_model.findOne({
            where : {
               email_id : email_id
            }
         })

    return res.status(200).json(successResponse("success","updated OTP sent and stored successfully", updated_otp_data ));
     
       }
   } catch (error) {
       console.error("Error:", error);
       return res.status(500).json(failureResponse("failure","Internal server error", error ));
   }
} 


const otpVErifyByMail = async (req, res) => {
   try{
        const email_id = req.body.email_id;
        const otp = req.body.otp;

        const isDataExists = await database.models.otp_model.findOne({
         where : {
            email_id : email_id
         }
        });

        console.log("is data esxista---------", isDataExists);

        if(!email_id) {
         return res.status(400).json(failureResponse("failure"," Please provide valid emaild id" ));
        }

        else  if(!otp) {
         return res.status(400).json(failureResponse("failure"," Please provide valid otp" ));
        }

        else if(otp !== isDataExists.otp) {
         console.log("otp----------", otp);
         console.log("isExsting otp --------", isDataExists.otp);
         return res.status(400).json(failureResponse("failure"," Please provide valid otp which we sent in your mail" ));

        }

        else {
         await database.models.otp_model.findOne({
           where : {
              email_id : email_id
           }
          });
  
          const isVerifyOtp = await database.models.otp_model.update({
           isVerified : true
          },{
           where : {
            email_id : email_id
           }
          });
  
           await database.models.otp_model.update({otp : null },
         {
           where : {
            email_id : email_id
           }
          });
       
       return res.status(200).json(successResponse("success", "otp verified successfully on existing email id", update_otp ))
      }


   }catch(error) {
      console.error("Error:", error);
      return res.status(500).json(failureResponse("failure",  "Internal server error", error ));
  
   }
}

module.exports = {sendOtpApi, otpverifyAPi, otpSendByMail, otpVErifyByMail};