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
  if (req.method === "POST" || req.method === "PUT")
    return JSON.stringify(req.body);
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
  let newPerson = new Person({
    name,
    number,
  });
  newPerson
    .save()
    .then((result) => res.json(result))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(403)
          .json({ message: "The name needs to be at least 3 letters long" });
      }
      next(err);
    });
});

app.put("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndUpdate(
    id,
    {
      name: req.body.name,
      number: req.body.number,
    },
    { runValidators: true }
  )
    .then((result) => {
      console.log(result);
      return res.json({
        result,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(403)
          .json({ message: "Both fields need to be filled" });
      }
      return next(err);
    });
});

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((result) => res.json(result))
    .catch(() => next(new Error("Could not find the requested person")));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then((result) => res.json(result))
    .catch((err) => next(err));
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
