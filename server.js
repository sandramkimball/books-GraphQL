const express = require('express')
const graphqlHTTP = require('express-graphql')
const schema = require('./schema')
const app = express()

//SCHEMA
//Contains types and all info on HOW to get data.
//Where the magic happens.

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))


app.listen(3003);
console.log('I am listening...');