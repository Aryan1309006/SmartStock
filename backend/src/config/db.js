const mongoose = require("mongoose");

const connectToDB = () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
module.exports=connectToDB;