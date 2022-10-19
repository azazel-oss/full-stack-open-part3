const express = require("express");

const app = express();

const PORT = process.env.PORT || 3001;

const persons = [
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
];

app.get("/api/persons", (req, res) => {
  return res.json(persons);
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
