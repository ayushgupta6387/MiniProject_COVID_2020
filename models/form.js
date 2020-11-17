const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true,
      max: 32,
    }, 
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        lowercase: true,
      },
    suggestion: {
        type: String,
        trim: true,
        required: true,
        max: 500
    },
  },
  {timestamps: true}
  );
  
  const Form = mongoose.model("Form", formSchema);
  
  module.exports = Form;