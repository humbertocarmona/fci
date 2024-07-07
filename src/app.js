import express from 'express';
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from 'bcrypt'; // Make sure this line is added
import {
  addUser,
  updateUserProgress,
  getUserByUsername,
  getUserProgress,
} from "./dbAddUsers.js";
import { checkAccess } from "./middleware.js";

import './dbSetup.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

console.log("addUser function:", addUser);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/libraries", express.static(path.join(__dirname, "..", "libraries")));
app.use(
  "/node_modules",
  express.static(path.join(__dirname, "..", "node_modules"))
);


// Serve the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

// Handle login form submission
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = getUserByUsername(username);

    if (user && bcrypt.compareSync(password, user.password)) {
        req.session.username = username;
        res.redirect(`/question01`);
    } else {
        res.status(401).send('Invalid login');
    }
});


// Serve the addUser page
app.get("/addUserForm", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "addUser.html"));
});

// Handle add user form submission
app.post('/addUser', (req, res) => {
    const { name, username, password } = req.body;
    try {
        console.log('Received form data:', name, username, password);
        addUser(name, username, password);
        res.send('User added successfully');
    } catch (err) {
        console.error('Error adding user:', err);
        res.status(500).send('Error adding user');
    }
});

// Serve question pages with access control
app.get('/question:questionNumber', checkAccess, (req, res) => {
    const questionNumber = req.params.questionNumber;
    res.sendFile(path.join(__dirname, `..`, `public`, `question${questionNumber}`, `index.html`));
});

// Endpoint to update user progress
app.post('/updateProgress', (req, res) => {
    const { username, progress } = req.body;
    try {
        updateUserProgress(username, progress);
        res.send('Progress updated successfully');
    } catch (err) {
        console.error('Error updating progress:', err);
        res.status(500).send('Error updating progress');
    }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

