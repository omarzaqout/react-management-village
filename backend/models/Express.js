const express = require("express");
const mongoose = require("mongoose");
const Image = require("./models/image"); // Assuming the image model is defined

const app = express();
app.use(express.json());

// Route to save image to database
app.post("/api/images", async (req, res) => {
  const { src, description, name } = req.body;

  try {
    const newImage = new Image({
      src,
      description,
      name,
    });

    await newImage.save();
    res.status(200).json({ success: true, image: newImage });
  } catch (error) {
    console.error("Error saving image:", error);
    res.status(500).json({ success: false, message: "Failed to save image" });
  }
});

mongoose
  .connect("mongodb://localhost:27017/gallery", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.listen(5000, () => console.log("Server running on port 5000"));
