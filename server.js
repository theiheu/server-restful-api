import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors"; // Import the cors package
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbFilePath = path.join(__dirname, "db.json");
// Helper function to read and write to the db.json file

const readData = () => {
  if (!fs.existsSync(dbFilePath)) {
    console.log("Line: 21 - Here");
    return { vocabularies: [] };
  }
  const data = fs.readFileSync(dbFilePath, "utf-8");
  return JSON.parse(data);
};

const writeData = (data) =>
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));

// Get all vocab
app.get("/vocab", (req, res) => {
  const data = readData();
  res.json(data.vocabularies);
});

// Add a new item
app.post("/vocab", (req, res) => {
  const data = readData();
  const newItem = {
    id: Date.now(),
    english: req.body.english,
    key: req.body.key,
    type: req.body.type,
    vietnamese: req.body.vietnamese,
    pronounce: req.body.pronounce,
    example: req.body.example,
  };
  data.vocabularies.push(newItem);
  writeData(data);
  res.status(201).json(newItem);
});

// Update an item
app.put("/vocab/:id", (req, res) => {
  const data = readData();
  const itemIndex = data.vocabularies.findIndex(
    (item) => item.id === parseInt(req.params.id)
  );

  console.log('Line: 62 - Here', data)
  if (itemIndex > -1) {
    data.vocabularies[itemIndex] = {
      ...data.vocabularies[itemIndex],
      english: req.body.english,
    key: req.body.key,
    type: req.body.type,
    vietnamese: req.body.vietnamese,
    pronounce: req.body.pronounce,
    example: req.body.example,
    };
    writeData(data);
    res.json(data.vocabularies[itemIndex]);
  } else {
    res.status(404).json({ message: "Item not found" });
  }
});

// Delete an item
app.delete("/vocab/:id", (req, res) => {
  const data = readData();
  data.vocabularies = data.vocabularies.filter(
    (item) => item.id !== parseInt(req.params.id)
  );
  writeData(data);
  res.status(204).end();
});

app.listen(PORT,'0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
