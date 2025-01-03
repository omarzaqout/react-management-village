const express = require("express");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const cors = require("cors"); 

const User = require("./models/user.js");
const Village= require("./models/village.js");

mongoose
  .connect("mongodb://localhost:27017/village")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

  const schema = buildSchema(`
    type Query {
      hello: String
      addNumbers(a: Int!, b: Int!): Int
      getUser(username: String!): User
      getUsers: [User]
      getVillage(VillageName: String!): Village
      getVillages: [Village]
    }
  
    type Mutation {
      userAdd(fullname: String!, username: String!, password: String!, email: String!, role: String): String
      userUpdate(username: String!, fullname: String, password: String, email: String, role: String): User
      userDelete(username: String!): String
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
        VillageName: String!
        RegionDistrict: String
        LandArea: Int
        Latitude: Float
        Longitude: Float
        Image: String
        CategoriesTags: String
      ): Village
    }
  
    type User {
      fullname: String
      username: String
      password: String
      email: String
      role: String
    }
  
    type Village {
      id:ID
      VillageName: String
      RegionDistrict: String
      LandArea: Int
      Latitude: Float
      Longitude: Float
      Image: String
      CategoriesTags: String
    }
  `);

const root = {
//User
  getUser: async ({ username }) => {
    const user = await User.findOne({ username });
    return user;
  },
  getUsers: async () => {
    const users = await User.find();
    return users;
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
      const savedUser = await newUser.save();
      return "User added successfully!";
    } catch (error) {
      console.error("Error adding user:", error);
      throw new Error("Failed to add user");
    }
  },
  userUpdate: async ({ username, fullname, password, email, role }) => {
    const user = await User.findOneAndUpdate(
      { username },
      { $set: { fullname, password, email, role } },
      { new: true }
    );
    return user;
  },
  userDelete: async ({ username }) => {
    const user = await User.findOneAndDelete({ username });
    return `user ? ${username} has been deleted. : User not found`;
  },
// Village
addVillage: async ({ VillageName, RegionDistrict, LandArea, Latitude, Longitude, Image, CategoriesTags }) => {
    const newVillage = new Village({
      VillageName,
      RegionDistrict,
      LandArea,
      Latitude,
      Longitude,
      Image,
      CategoriesTags: CategoriesTags || "undefined",
    });
  
    try {
      await newVillage.save();
      return "Village added successfully!";
    } catch (error) {
      console.error("Error adding village:", error);
      throw new Error("Failed to add village");
    }
  },
  

  getVillage: async ({ VillageName }) => {
    try {
      const village = await Village.findOne({ VillageName });
      return village;
    } catch (error) {
      console.error("Error fetching village:", error);
      throw new Error("Failed to fetch village");
    }
  },

  getVillages: async () => {
    try {
      const villages = await Village.find();
      return villages;
    } catch (error) {
      console.error("Error fetching villages:", error);
      throw new Error("Failed to fetch villages");
    }
  },

  updateVillage: async ({ VillageName, RegionDistrict, LandArea, Latitude, Longitude, Image, CategoriesTags }) => {
    try {
      const updatedVillage = await Village.findOneAndUpdate(
        { VillageName },
        { $set: { RegionDistrict, LandArea, Latitude, Longitude, Image, CategoriesTags } },
        { new: true }
      );

      return updatedVillage;
    } catch (error) {
      console.error("Error updating village:", error);
      throw new Error("Failed to update village");
    }
  },
};

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/villages", async (req, res) => {
    const { VillageName, RegionDistrict, LandArea, Latitude, Longitude, Image, CategoriesTags } = req.body;
  
    if (!VillageName || !RegionDistrict || !LandArea || !Latitude || !Longitude) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }
  
    const landAreaNumber = parseFloat(LandArea);
    const latitudeNumber = parseFloat(Latitude);
    const longitudeNumber = parseFloat(Longitude);
  
    if (isNaN(landAreaNumber) || isNaN(latitudeNumber) || isNaN(longitudeNumber)) {
      return res.status(400).json({ error: "LandArea, Latitude, and Longitude must be valid numbers" });
    }
  
    const newVillage = new Village({
      VillageName,
      RegionDistrict,
      LandArea: landAreaNumber,
      Latitude: latitudeNumber,
      Longitude: longitudeNumber,
      Image,
      CategoriesTags: CategoriesTags || "undefined",
    });
  
    try {
      await newVillage.save();
      res.status(201).json({ message: "Village added successfully", village: newVillage });
    } catch (error) {
      console.error("Error adding village:", error);
      res.status(500).json({ error: "Failed to add village" });
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