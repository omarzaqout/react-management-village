const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const { buildSchema } = require('graphql');

const app = express();

mongoose.connect('mongodb://localhost/yourdb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error(err));

const schema = buildSchema(`
  type Query {
    getItems: [Item]
  }
  type Item {
    id: ID
    name: String
    description: String
  }
`);

// تعريف الدوال الخاصة بالـ Resolvers
const root = {
  getItems: async () => {
    return await Item.find();
  },
};

// إنشاء السيرفر
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(4000, () => console.log('Server running on http://localhost:4000/graphql'));
