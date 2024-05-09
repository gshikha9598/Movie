const { fail } = require("assert");
const { json, response } = require("express");
const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");

const app = express();
const PORT = 8000;
const cors = require("cors");

app.use(
  cors({
    origin: "http://127.0.0.1:5501",
  })
);

//Middleware - Plugin
app.use(express.urlencoded({ extended: false }));

//REST API
app.get("/api/users", (req, res) => {
  return res.json(users);
});

app
  .route("/api/users/:id")

  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((e) => e.id === id);
    return res.json(user);
  })

  .patch((req, res) => {
    const id = req.params.id * 1; // Extract the ID from request parameters
    const newData = req.body; // Updated data sent in the request body

    const userIndex = users.findIndex((user) => user.id === id); // Find the index of the user with the specified ID

    if (!userIndex) {
      // If user doesn't exist, return a 404 response
      return res.status(404).json({
        status: "fail",
        message: `No data with Id ${id} is found to update`,
      });
    }

    const updatedUser = { ...users[userIndex], ...newData }; // Merge updated data with existing user data

    users[userIndex] = updatedUser; // Update the user object in the array

    // Write the updated users array back to the JSON file
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
      if (err) {
        // Error handling for writing to file
        console.error("Error writing to file:", err); // Log the error for debugging
        return res.status(500).json({
          status: "error",
          message: "Error updating user",
        });
      }

      // Return a 200 response with success message and updated user data
      res.status(200).json({
        status: "success",
        message: `User with Id ${id} updated successfully`,
        data: updatedUser, // Send back the updated user data
      });
    });
  })

  .delete((req, res) => {
    const id = Number(req.params.id);
    const userToDelete = users.findIndex((user) => user.id === id);

    if (!userToDelete) {
      return res.status(404).json({
        status: "fail",
        message: `No data with Id ${id} is found to delete`,
      });
    }

    users.splice(userToDelete, 1); //delete only 1 record

    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: "Error updating user",
        });
      }

      res.status(204).json({
        status: "success",
        message: `User with Id ${id} deleted successfully`,
      });
    });
  });

app.post("/api/users", (req, res) => {
  const body = req.body;
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    if (err) {
      console.error("Error writing to file:", err);
      return res
        .status(500)
        .json({ status: "error", message: "Failed to add user" });
    }
    return res.json({ status: "success", id: users.length });
  });
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
