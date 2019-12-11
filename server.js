const express = require('express')
const graphqlHTTP = require('express-graphql')
const app = express()
const fetch = ('node-fetch')
const schema = require('./schema')
const DataLoader = require('dataloader')
const util = require('util')
const parseXML = util.promisify(require('xml2js').parseString)

const fetchAuthor = id => {
    fetch(`https://www.goodreads.com/author/show.xml?id=${id}&key=x7VoLKspIa5LO9bMmwxvIw`
    )
    .then(res=> res.text())
    .then(parseXML)
}

const fetchBook = id => {
    fetch(`https://www.goodreads.com/book/show${id}.xml?key=x7VoLKspIa5LO9bMmwxvIw`)
        .then(res=> res.text())
        .then(parseXML)
}


app.use('/graphql', graphqlHTTP(req=> {
    //one param: a func (keys obj) returns a promise of array of values for keys
    const authorLoader = new DataLoader(keys=>
        Promise.all(keys.map(fetchAuthor)))
    
    const bookLoader = new DataLoader(keys=> 
        Promise.all(keys.map(fetchBook)))
    
    return {
        schema,
        context: {
            authorLoader,
            bookLoader
        },
        graphiql: true
    }
}))


app.listen(3003);
console.log('I am listening...');