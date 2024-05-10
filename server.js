const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const dotenv = require("dotenv");


const database = require("./config/database_config");

const vendorRoutes = require("./src/routes/vendors_routes");
const otpRoutes = require("./src/routes/otp_routes");

const corsOptions = {
    origin : "*",
    corsStatus : 200
};

const PORT = 5001 || process.env.PORT;
const app = express();
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true , limit : "100mb"}));
app.use(bodyParser.json());
app.use(helmet());

app.use("/api", vendorRoutes);
app.use("/api",otpRoutes);

async function init() {
    try {
      await database.instanceSequelize.authenticate();
      console.log("mysql database connected sucsessfully");

      app.use(compression());
      app.use(cors(corsOptions));

      app.listen(PORT, () => {
        console.log(`server start to connect successfully ${PORT} `);
      })
    }catch(error) {
         console.log("unable to connect mysql database");
    }
}

init();

database.instanceSequelize.sync({ force : false})
.then(() => {
    console.log("models are syncroised with databse successfully");
})
.catch((error) => {
    console.log("unable to connect mysql database");
})