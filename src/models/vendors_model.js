module.exports = (Sequelize, DataTypes) => {
    const vendor = Sequelize.define("vendor", {
        mobile_number : {
            type : DataTypes.STRING

        },
        email_id : {
            type : DataTypes.STRING
        },
        vendor_name : {
            type : DataTypes.STRING
        },
        password: {
            type : DataTypes.STRING
        }
    })
    return vendor;
}