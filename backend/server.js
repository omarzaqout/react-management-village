const express = require("express");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const User = require("./models/user.js");
const Village = require("./models/village.js");
const Message = require("./models/message.js");

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/village")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// GraphQL schema
const schema = buildSchema(`
  type Query {
    getMessages(adminName: String!): [Message]
    getUsers: [User]
    getVillages: [Village]
    userLogin(username: String!, password: String!): UserResponse
  }

  type Mutation {
    addMessage(sender: String!, text: String!, adminName: String!): Message
    userAdd(fullname: String!, username: String!, password: String!, email: String!, role: String): String
    addVillage(
      VillageName: String!
      RegionDistrict: String!
      LandArea: Int!
      Latitude: Float!
      Longitude: Float!
      Image: String
      CategoriesTags: String
    ): String
  }

  type UserResponse {
    success: Boolean
    user: User
    message: String
  }

  type User {
    fullname: String
    username: String
    password: String
    email: String
    role: String
  }

  type Message {
    id: ID
    sender: String
    text: String
    adminName: String
    timestamp: String
  }

  type Village {
    id: ID
    VillageName: String
    RegionDistrict: String
    LandArea: Int
    Latitude: Float
    Longitude: Float
    Image: String
    CategoriesTags: String
  }
`);

// Root resolver
const root = {
  getMessages: async ({ adminName }) => {
    try {
      const messages = await Message.find({ adminName }).sort({ timestamp: 1 });
      return messages;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw new Error("Failed to fetch messages");
    }
  },
  addMessage: async ({ sender, text, adminName }) => {
    const newMessage = new Message({ sender, text, adminName });
    try {
      await newMessage.save();
      return newMessage;
    } catch (error) {
      console.error("Error adding message:", error);
      throw new Error("Failed to add message");
    }
  },
  userAdd: async ({ fullname, username, password, email, role }) => {
    const newUser = new User({
      fullname,
      username,
      password,
      email,
      role: role || "user",
    });

    try {
      await newUser.save();

      const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Welcome to the Village System",
        text: `Hello ${fullname},\n\nWelcome to our system! Your account has been successfully created.\n\nUsername: ${username}\nRole: ${
          role || "user"
        }`,
      };

      await transporter.sendMail(mailOptions);

      return "User added successfully and email sent!";
    } catch (error) {
      console.error("Error adding user or sending email:", error);
      throw new Error("Failed to add user or send email");
    }
  },
  addVillage: async (data) => {
    const newVillage = new Village(data);
    try {
      await newVillage.save();
      return "Village added successfully!";
    } catch (error) {
      console.error("Error adding village:", error);
      throw new Error("Failed to add village");
    }
  },
  getUsers: async () => {
    const users = await User.find();
    return users;
  },
  getVillages: async () => {
    const villages = await Village.find();
    return villages;
  },
  userLogin: async ({ username, password }) => {
    try {
      const user = await User.findOne({ username, password });
      if (user) {
        return { success: true, user };
      } else {
        return { success: false, message: "Invalid username or password" };
      }
    } catch (error) {
      console.error("Error logging in:", error);
      throw new Error("Failed to login");
    }
  },
};

// Express app setup
const app = express();
app.use(cors());
app.use(express.json());

// Reset password endpoint
app.post("/api/reset-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resetLink = `http://localhost:3000/reset-password?email=${email}`;

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Password Reset",
      text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}\n\nIf you didn't request this, please ignore this email.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Reset link sent to your email." });
  } catch (error) {
    console.error("Error in reset-password:", error);
    res.status(500).json({ error: "Failed to send reset email." });
  }
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/graphql`);
});
