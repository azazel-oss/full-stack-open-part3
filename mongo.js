const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const personSchema = new Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length < 3) {
  console.log("Please input password");
  process.exit(1);
}

const uri = `mongodb+srv://user:${process.argv[2]}@phonebook.mgijts1.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(uri).then(() => {
  if (process.argv.length === 3) {
    Person.find({})
      .then((results) => {
        console.log("phonebook:");
        for (const result of results) {
          console.log(result.name, result.number);
        }
      })
      .then(() => mongoose.connection.close());
  } else if (process.argv.length === 5) {
    const newPerson = new Person({
      name: process.argv[3],
      number: process.argv[4],
    });

    newPerson
      .save()
      .then(() =>
        console.log(
          `added ${newPerson.name} number ${newPerson.number} to phonebook`
        )
      )
      .then(() => mongoose.connection.close());
  } else {
    console.log("something went wrong");
    mongoose.connection.close();
  }
});
