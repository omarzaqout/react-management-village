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
const Image = require("./models/image.js");
const Image = require("./models/Image.js");

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/village", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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
    getUsers: [User]
    getVillages: [Village]
    userLogin(username: String!, password: String!): UserResponse
    getMessages(senderUsername: String!, receiverUsername: String!): [ChatMessage]

    getImages: [Image] 

     getAllVillages: [String]
    getAllVillagesPopulation: [Int]
    getAgeDistribution: [Float]
    getGenderRatios: [Float]
    getTotalVillages: Int 
    getTotalUrban: Int
    getTotalPopulation: Int
    getTotalArea: Float
    getAllLocations: [[Float]]
    getImages: [Image] 



  }

  type Mutation {
    addImageWithLink(link: String!, description: String!, name: String!): String

      addImageWithLink(link: String!, description: String!, name: String!): String
  addImage(name: String!, description: String!, image: String!): Image
    addMessage(sender: String!, text: String!, adminName: String!): Message
    userAdd(fullname: String!, username: String!, password: String!, email: String!, role: String): String
    sendMessage(senderUsername: String!, receiverUsername: String!, message: String!): String
    addVillage(
      VillageName: String!
      RegionDistrict: String!
      LandArea: Int!
      Latitude: Float!
      Longitude: Float!
      Image: String
      CategoriesTags: String
    ): String
          updateVillage(
          id:Int!
        VillageName: String!
        RegionDistrict: String
        LandArea: Int
        Latitude: Float
        Longitude: Float
        Image: String
        CategoriesTags: String
      ): Village
  deleteVillage(id: ID!): Village
   updateDemography(
      id: Int!
      pu18: Float
      pu35: Float
      pu50: Float
      pu65: Float
      p65: Float
      malePercentage: Float
      femalePercentage: Float
      populationGrowthRate:Float
      population:Int
    ): Village


  }

   type Image {
    id: ID!
    src: String!
    description: String!
    name: String!
  }

  type ChatMessage {
    id: String
    sender: String
    receiver: String
    message: String
  }
 type Image {
    id: ID!
    src: String!
    description: String!
    name: String!
  }
    

  type ChatMessages {
    sentMessages: [ChatMessage]
    receivedMessages: [ChatMessage]
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
    location: [Float]
    pu18: Float
    pu35: Float
     pu50: Float
     pu65: Float
     p65: Float
     malePercentage: Float
    femalePercentage: Float
    populationGrowthRate:Float
    population:Int
  }


`);

// Root resolver
const root = {
  addImage: async ({ name, description, imageUrl }) => {
    const newImage = new Image({
      name,
      description,
      imageUrl
    });
    try {
      await newImage.save();
      return newImage;
    } catch (error) {
      console.error("Error adding image:", error);
      throw new Error("Failed to add image");
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
    const { Latitude, Longitude, ...rest } = data;
    const newVillage = new Village({
      ...rest,
      Latitude,
      Longitude,
      location: [Latitude, Longitude],
    });
    try {
      await newVillage.save();
      return "Village added successfully!";
    } catch (error) {
      console.error("Error adding village:", error);
      throw new Error("Failed to add village");
    }
  },
  updateVillage: async ({
    id,
    VillageName,
    RegionDistrict,
    LandArea,
    Latitude,
    Longitude,
    Image,
    CategoriesTags,
  }) => {
    try {
      const updatedVillage = await Village.findOneAndUpdate(
        { id },
        {
          $set: {
            VillageName,
            RegionDistrict,
            LandArea,
            Latitude,
            Longitude,
            Image,
            CategoriesTags,
            location: [Latitude, Longitude], // Automatically update location array
          },
        },
        { new: true }
      );
      return updatedVillage;
    } catch (error) {
      console.error("Error updating village:", error);
      throw new Error("Failed to update village");
    }
  },
  updateDemography: async ({
    id,
    pu18,
    pu35,
    pu50,
    pu65,
    p65,
    malePercentage,
    femalePercentage,
    populationGrowthRate,
    population,
  }) => {
    try {
      const updatedVillage = await Village.findOneAndUpdate(
        { id },
        {
          $set: {
            pu18,
            pu35,
            pu50,
            pu65,
            p65,
            malePercentage,
            femalePercentage,
            populationGrowthRate,
            population,
          },
        },
        { new: true }
      );
      return updatedVillage;
    } catch (error) {
      console.error("Error updating demography:", error);
      throw new Error("Failed to update demography");
    }
  },

  deleteVillage: async (id) => {
    try {
      console.log("Received id:", id.id);

      const villageId = Number(id.id);
      console.log(`Converted id to: ${villageId}`);

      if (isNaN(villageId)) {
        throw new Error("Invalid ID provided");
      }

      const deletedVillage = await Village.findOneAndDelete({ id: villageId });

      if (!deletedVillage) {
        throw new Error("Village not found");
      }
      return deletedVillage;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to delete village");
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
  getMessages: async ({ senderUsername, receiverUsername }) => {
    const sender = await User.findOne({ username: senderUsername });
    const receiver = await User.findOne({ username: receiverUsername });

    if (!sender || !receiver) {
      throw new Error("Sender or Receiver not found");
    }

    const messages = await Message.find({
      $or: [
        { fromUsername: senderUsername, toUsername: receiverUsername },
        { fromUsername: receiverUsername, toUsername: senderUsername },
      ],
    }).sort({ createdAt: 1 });

    return messages.map((msg) => ({
      id: msg._id.toString(),
      sender: msg.fromUsername,
      receiver: msg.toUsername,
      message: msg.message,
    }));
  },
  sendMessage: async ({ senderUsername, receiverUsername, message }) => {
    const sender = await User.findOne({ username: senderUsername });
    const receiver = await User.findOne({ username: receiverUsername });

    if (!sender || !receiver) {
      throw new Error("Sender or Receiver not found");
    }

    const newMessage = new Message({
      fromUsername: sender.username,
      toUsername: receiver.username,
      message: message,
    });

    try {
      await newMessage.save();
      return `Message sent successfully from ${senderUsername} to ${receiverUsername}`;
    } catch (error) {
      console.error("Error saving message:", error);
      throw new Error("Failed to send message");
    }
  },
  getUserChatMessages: async ({ username }) => {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("User not found");
    }

    const sentMessages = await Message.find({ fromUsername: username }).lean();
    const receivedMessages = await Message.find({
      toUsername: username,
    }).lean();

    return {
      sentMessages: sentMessages.map((msg) => ({
        id: msg.id,
        sender: msg.fromUsername,
        receiver: msg.toUsername,
        message: msg.message,
      })),
      receivedMessages: receivedMessages.map((msg) => ({
        id: msg.id,
        sender: msg.fromUsername,
        receiver: msg.toUsername,
        message: msg.message,
      })),
    };
  },

  addImageWithLink: async ({ link, description, name }) => {
    const newImage = new Image({ src: link, description, name });
    await newImage.save();
    return "Image added successfully!";
  },

  getImages: async () => {
    const images = await Image.find(); // جلب الصور من قاعدة البيانات
    return images;
  },
  getAllVillages: async () => {
    try {
      const villages = await Village.find().select("VillageName");
      console.log(
        "vlg:",
        villages.map((village) => village.VillageName)
      );

      return villages.map((village) => village.VillageName);
    } catch (error) {
      console.error("Error fetching villages:", error);
      return [
        "Jabalia",
        "Beit Lahia",
        "Quds",
        "Shejaiya",
        "Hebron",
        "Nablus",
        "Ramallah",
        "Beit Jala",
      ];
    }
  },
  getAllVillagesPopulation: async () => {
    try {
      const villages = await Village.find().select("population");
      console.log(
        "pop:",
        villages.map((village) => village.population)
      );
      return villages.map((village) => village.population);
    } catch (error) {
      console.error("Error fetching village populations:", error);
      return [50000, 35000, 20000, 43000, 250000, 150000, 100000, 20000];
    }
  },
  getAgeDistribution: async () => {
    try {
      const villages = await Village.find();
      const totalVillages = villages.length;
      const totals = { pu18: 0, pu35: 0, pu50: 0, pu65: 0, p65: 0 };
      villages.forEach((village) => {
        totals.pu18 += village.pu18;
        totals.pu35 += village.pu35;
        totals.pu50 += village.pu50;
        totals.pu65 += village.pu65;
        totals.p65 += village.p65;
      });
      return Object.values(totals).map((total) => total / totalVillages);
    } catch (error) {
      console.error("Error calculating age distribution:", error);
      return [55, 90, 44, 24, 15];
    }
  },
  getGenderRatios: async () => {
    try {
      const villages = await Village.find();
      const totalVillages = villages.length;
      let maleTotal = 0;
      let femaleTotal = 0;
      villages.forEach((village) => {
        maleTotal += village.malePercentage;
        femaleTotal += village.femalePercentage;
      });
      return [maleTotal / totalVillages, femaleTotal / totalVillages];
    } catch (error) {
      console.error("Error calculating gender ratios:", error);
      return [55, 45];
    }
  },
  getTotalVillages: async () => {
    try {
      const countRural = await Village.countDocuments({
        CategoriesTags: { $regex: /^rural$/i },
      });
      console.log("countRural:", countRural);
      return countRural;
    } catch (error) {
      console.error("error ", error);
      return 0;
    }
  },
  getTotalUrban: async () => {
    try {
      const countUrban = await Village.countDocuments({
        CategoriesTags: { $regex: /^urban$/i },
      });
      console.log("countUrban:", countUrban);
      return countUrban;
    } catch (error) {
      console.error("error ", error);
      return 0;
    }
  },
  getTotalPopulation: async () => {
    try {
      const villages = await Village.find().select(
        "pu18 pu35 pu50 pu65 p65 -_id"
      );
      return villages.reduce((sum, village) => {
        return (
          sum +
          village.pu18 +
          village.pu35 +
          village.pu50 +
          village.pu65 +
          village.p65
        );
      }, 0);
    } catch (error) {
      console.error("Error fetching total population:", error);
      return 660000;
    }
  },
  getTotalArea: async () => {
    try {
      const villages = await Village.find().select("LandArea");
      console.log();
      return villages.reduce((sum, village) => sum + village.LandArea, 0);
    } catch (error) {
      console.error("Error fetching total LandArea:", error);
      return 11.88;
    }
  },
  getAllLocations: async () => {
    try {
      const villages = await Village.find().select("location -_id");
      return villages.map((village) => village.location);
    } catch (error) {
      console.error("Error fetching locations:", error);
      return [
        [31.528205, 34.483131],
        [31.549669, 34.502813],
        [31.776209, 35.235622],
        [31.50043, 34.478241],
        [31.529621, 35.097351],
        [32.22112, 35.26077],
        [31.904931, 35.204428],
        [31.716214, 35.187664],
      ];
    }
  },
  addImageWithLink: async ({ link, description, name }) => {
    const newImage = new Image({ src: link, description, name });
    await newImage.save();
    return "Image added successfully!";
  },
  getImages: async () => {
    const images = await Image.find();  // جلب الصور من قاعدة البيانات
    return images;
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
