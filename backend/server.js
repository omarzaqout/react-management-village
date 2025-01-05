const express = require("express");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const cors = require("cors"); // إضافة مكتبة CORS

// استيراد نموذج المستخدم
const User = require("./models/user.js");

// الاتصال بقاعدة البيانات
mongoose
  .connect("mongodb://localhost:27017/village")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

// إنشاء مخطط GraphQL (Schema)
const schema = buildSchema(`
  type Query {
    hello: String
    addNumbers(a: Int!, b: Int!): Int
    getUser(username: String!): User
    getUsers: [User]
    getAllVillages: [String]
    getAllVillagesPopulation: [Int]
    getAgeDistribution: [Float]
    getGenderRatios: [Float]
    getTotalVillages: Int 
    getTotalUrban: Int
    getTotalPopulation: Int
    getTotalArea: Float
    getAllLocations: [[Float]]
  }

  type Mutation {
    userAdd(fullname: String!, username: String!, password: String!, email: String!, role: String): String
    userUpdate(username: String!, fullname: String, password: String, email: String, role: String): User
    userDelete(username: String!): String
  }

  type Village {
    villageName: String
    urban: Boolean
    area: Float
    pu18: Float
    pu35: Float
    pu50: Float
    pu65: Float
    p65: Float
    malePercentage: Float
    femalePercentage: Float
    location: [Float]
  }

  type User {
    fullname: String
    username: String
    password: String
    email: String
    role: String
  }`);

// إعداد الريزولفرز (Resolvers)
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
    return user ? `User ${username} has been deleted.` : "User not found.";
  },
  getAllVillages: () => {
    // Mock village names data
    return ["Jabalia", "Beit Lahia", "Quds", "Shejaiya", "Hebron", "Nablus", "Ramallah", "Beit Jala"];
  },
  getAllVillagesPopulation: () => {
    // Mock population data corresponding to the villages
    return [50000, 35000, 20000, 43000, 250000, 150000, 100000, 20000];
  },
  getAgeDistribution: () => {
    // Mock population data corresponding to the villages
    return [55, 90, 44, 24, 15];
  },
  getGenderRatios: () => {
    // Mock population data corresponding to the villages
    return [55, 45];
  },
  getTotalVillages: () => {
    // Mock population data corresponding to the villages
    return 8;
  },
  getTotalUrban: () => {
    // Mock population data corresponding to the villages
    return 8;
  },
  getTotalPopulation: () => {
    // Mock population data corresponding to the villages
    return 660000;
  },
  getTotalArea: () => {
    // Mock population data corresponding to the villages
    return 11.88;
  },
  getAllLocations: () => {
    // Mock population data corresponding to the villages
    return [
      [31.528205, 34.483131],
      [31.549669, 34.502813],
      [31.776209, 35.235622],
      [31.500430, 34.478241],
      [31.529621, 35.097351],
      [32.221120, 35.260770],
      [31.904931, 35.204428],
      [31.716214, 35.187664]
    ];
  },
};

// إنشاء تطبيق Express
const app = express();

// إضافة CORS للسماح بالاتصال من واجهة العميل
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"], // Add both origins
  })
);
 // تأكد من السماح للواجهة الأمامية (frontend) بالوصول

// إعداد GraphQL
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // تفعيل واجهة GraphiQL التفاعلية
  })
);

// بدء السيرفر
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/graphql`);
});
