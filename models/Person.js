const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const personSchema = new Schema({
  name: {
    type: String,
    minLength: [3, "The name should be at least 3 letters long"],
    required: true,
    unique: [true, "This name is already registered"],
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        let arr = v.split("-");
        if (arr.length > 2) return false;
        if (arr.join("").length < 8) return false;
        if (v.includes("-")) {
          return /\d{2,3}-\d+/.test(v);
        }
        return true;
      },
      message: "The number you have entered is not valid",
    },
  },
});

mongoose.connect(process.env.MONGODB_URI, {
  autoIndex: true,
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
