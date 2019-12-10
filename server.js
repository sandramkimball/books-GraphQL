const express = require('express')
const graphqlHTTP = require('express-graphql')
const app = express()

//SCHEMA
//Contains types and all info on HOW to get data.
//Where the magic happens.
const schema = require('./schema')

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))


app.listen(3003);
console.log('I am listening...');