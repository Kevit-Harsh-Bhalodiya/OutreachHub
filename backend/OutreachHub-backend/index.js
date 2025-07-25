const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ debug: true });
const PORT = process.env.PORT || 8000;
const app = express();
const userRoutes = require("./routes/user.js");
const contactRoutes = require("./routes/contact.js");
const workspaceRoutes = require("./routes/workspace.js");
const tagRoutes = require("./routes/tag.js");
mongoose
  .connect(process.env.mongo_db)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error(`Error connecting to MongoDB Atlas: `, err));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoutes);
app.use("/contact", contactRoutes);
app.use("/workspace", workspaceRoutes);
app.use("/tag", tagRoutes);
app.get("/", (req, res, next) => {
  res.json({ message: "Hello World!" });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
