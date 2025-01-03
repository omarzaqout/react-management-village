const express = require("express");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const cors = require("cors"); 

const User = require("./models/user.js");

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
  }

  type Mutation {
    userAdd(fullname: String!, username: String!, password: String!, email: String!, role: String): String
    userUpdate(username: String!, fullname: String, password: String, email: String, role: String): User
    userDelete(username: String!): String
  }

  type User {
    fullname: String
    username: String
    password: String
    email: String
    role: String
  }`
);

const root = {
  hello: () => "Hello, GraphQL!",
  addNumbers: ({ a, b }) => a + b,
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
};

const app = express();

app.use(cors());

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