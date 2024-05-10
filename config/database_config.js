const {Sequelize, DataTypes} = require("sequelize");

const vendorModel = require("../src/models/vendors_model");
const otpModel = require("../src/models/otp_model");
const otp_model = require("../src/models/otp_model");



const instanceSequelize = new Sequelize("ecommerce", "root", "Khaja05$", {
    host : "localhost",
    dialect : "mysql"
});

const models = {
    vendor_model : vendorModel(instanceSequelize, DataTypes),
    otp_model : otpModel(instanceSequelize, DataTypes)
}

module.exports = {instanceSequelize, models};