const express = require("express");
const logger = require("morgan");

const app = express();

const PORT = process.env.PORT || 3001;

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: 5,
    name: "Asad",
    number: "12321312",
  },
];

app.use(express.json());

app.use(logger("tiny"));
app.get("/api/persons", (req, res) => {
  return res.json(persons);
});

app.post("/api/persons", (req, res) => {
  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(401).json({ message: "Both fields need to be filled" });
  }
  if (
    persons.find((person) => person.name.toLowerCase() === name.toLowerCase())
  ) {
    return res
      .status(401)
      .json({ message: "This name already exists in the phonebook" });
  }
  persons.push({
    id: Math.ceil(Math.random() * 1000000),
    name,
    number,
  });
  return res.json({ message: "Person added successfully" });
});

app.get("/api/persons/:id", (req, res) => {
  let person = persons.find((person) => person.id === +req.params.id);
  if (person) return res.json(person);
  return res
    .status(404)
    .json({ message: "Could not find the requested person" });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  let existingPersonIndex = persons.findIndex((person) => person.id === id);
  if (existingPersonIndex === -1) {
    return res.json({ message: "Count not delete the requested person" });
  }
  persons = persons.filter((person) => person.id !== id);
  return res.json({ message: "Person deleted successfully" });
});

app.get("/info", (req, res) => {
  return res.send(
    `Phonebook has info for ${
      persons.length
    } people ${new Date().toUTCString()}`
  );
});

app.listen(PORT, () => {
  console.log("I am listening on port 3001");
});
