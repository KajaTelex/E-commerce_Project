module.exports = (Sequelize, DataTypes) => {
    const otp = Sequelize.define("otp", {
        mobile_number : {
            type : DataTypes.STRING
        },
        email_id : {
            type : DataTypes.STRING
        },
        
        otp : {
            type : DataTypes.STRING
        },
        isVerified
         : {
            type : DataTypes.BOOLEAN,
            defaultValue : false
        }
    })

    return otp;
}