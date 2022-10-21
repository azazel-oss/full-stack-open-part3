require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const Person = require("./models/Person");

const app = express();

const PORT = process.env.PORT;

app.use(cors());

app.use(express.static("build"));
app.use(express.json());

logger.token("body", (req, res) => {
  if (req.method === "POST") return JSON.stringify(req.body);
  return "";
});

app.use(
  logger(":method :url :status :res[content-length] - :response-time ms :body")
);
app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((results) => res.json(results))
    .catch((err) => next(err));
});

app.post("/api/persons", (req, res, next) => {
  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(401).json({ message: "Both fields need to be filled" });
  }
  // if (
  //   persons.find((person) => person.name.toLowerCase() === name.toLowerCase())
  // ) {
  //   return res
  //     .status(401)
  //     .json({ message: "This name already exists in the phonebook" });
  // }
  let newPerson = new Person({
    name,
    number,
  });
  // persons.push(newPerson);
  newPerson
    .save()
    .then((result) => res.json(result))
    .catch((err) => next(err));
});

app.get("/api/persons/:id", (req, res) => {
  let person = persons.find((person) => person.id === +req.params.id);
  if (person) return res.json(person);
  return res
    .status(404)
    .json({ message: "Could not find the requested person" });
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then((result) => res.json(result))
    .catch((err) => next(err));
  // let existingPersonIndex = persons.findIndex((person) => person.id === id);
  // if (existingPersonIndex === -1) {
  //   return res.json({ message: "Count not delete the requested person" });
  // }
  // persons = persons.filter((person) => person.id !== id);
});

app.get("/info", (req, res, next) => {
  Person.find({})
    .then((results) =>
      res.json(
        `Phonebook has info for ${
          results.length
        } people ${new Date().toUTCString()}`
      )
    )
    .catch((err) => next(err));
});

app.all("*", (req, res, next) => {
  next(new Error("Page not found"));
});

app.use((error, req, res, next) => {
  return res.json({ message: error.message });
});

app.listen(PORT, () => {
  console.log(`I am listening on port ${PORT}`);
});
