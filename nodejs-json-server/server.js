const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

let users = [];

app.use(cors());
app.use(bodyParser.json());

app.get("/login", (req, res) => {
  res.status(200).json({
    data: {
      user: {
        username: "test",
        name: "Test User",
      },
      token: "kiuwesdfsfsfsfswnsdisduiewnewj",
    },
    message: "User fetched successfully",
  });
});

app.get("/allUsers", (req, res) => {
  res.status(200).json({
    data: users,
    message: "Users fetched successfully",
  });
});

app.post("/createUser", (req, res) => {
  const {  email, username ,jobRole} = req.body;

console.log(req.body,"req.body")
  if (!email || !username|| !jobRole) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const newUser = {
    id: users.length + 1,
    email,
    username,
    jobRole
  };

  users.push(newUser);
  res.status(201).json({
    data: newUser,
    message: "User created successfully",
  });
});

app.patch("/updateUser/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email, username } = req.body;

  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users[userIndex] = {
    ...users[userIndex],
    name: name || users[userIndex].name,
    email: email || users[userIndex].email,
    username: username || users[userIndex].username,
  };

  res.status(200).json({
    data: users[userIndex],
    message: "User updated successfully",
  });
});

app.delete("/deleteUser/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users.splice(userIndex, 1);
  res.status(200).json({ data: true, message: "User deleted successfully" });
});

app.listen(port, () => {
  console.log(` Server running at http://localhost:${port}`);
});
