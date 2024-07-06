import express from 'express';
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { addUser } from "./dbAddUsers.js";


// import './dbSetup.js';
// import './dbAddUsers.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/addUserForm", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "addUser.html"));
});


app.post("/addUser", (req, res) => {
  const { name, username } = req.body;
  try {
    addUser(name, username);
    res.send("User added successfully");
  } catch (err) {
    res.status(500).send("Error adding user");
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

