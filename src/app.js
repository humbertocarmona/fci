import express from 'express';
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

