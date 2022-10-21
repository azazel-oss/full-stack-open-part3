const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const personSchema = new Schema({
  name: String,
  number: String,
});

mongoose.connect(process.env.MONGODB_URI);

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
