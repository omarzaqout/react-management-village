const express = require("express");
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const cors = require("cors"); // إضافة مكتبة CORS

// استيراد نموذج المستخدم
const User = require("./models/user.js");
const Village = require("./models/village.js");

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
  getAllVillages: async () => {
    try {
      const villages = await Village.find().select("villageName -_id");
      return villages.map((village) => village.villageName);
    } catch (error) {
      console.error("Error fetching villages:", error);
      return ["Jabalia", "Beit Lahia", "Quds", "Shejaiya", "Hebron", "Nablus", "Ramallah", "Beit Jala"];
    }
  },
  getAllVillagesPopulation: async () => {
    try {
      const villages = await Village.find().select("pu18 pu35 pu50 pu65 p65 -_id");
      return villages.map((village) => {
        return village.pu18 + village.pu35 + village.pu50 + village.pu65 + village.p65;
      });
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
      const count = await Village.countDocuments({ urban: false });
      return count;
    } catch (error) {
      console.error("Error fetching total villages:", error);
      return 8;
    }
  },
  getTotalUrban: async () => {
    try {
      const count = await Village.countDocuments({ urban: true });
      return count;
    } catch (error) {
      console.error("Error fetching total urban villages:", error);
      return 8;
    }
  },
  getTotalPopulation: async () => {
    try {
      const villages = await Village.find().select("pu18 pu35 pu50 pu65 p65 -_id");
      return villages.reduce((sum, village) => {
        return sum + village.pu18 + village.pu35 + village.pu50 + village.pu65 + village.p65;
      }, 0);
    } catch (error) {
      console.error("Error fetching total population:", error);
      return 660000;
    }
  },
  getTotalArea: async () => {
    try {
      const villages = await Village.find().select("area -_id");
      return villages.reduce((sum, village) => sum + village.area, 0);
    } catch (error) {
      console.error("Error fetching total area:", error);
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
        [31.500430, 34.478241],
        [31.529621, 35.097351],
        [32.221120, 35.260770],
        [31.904931, 35.204428],
        [31.716214, 35.187664],
      ];
    }
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
