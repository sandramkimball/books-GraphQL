// const fetch = require('node-fetch')
const util = require('util')
const parseXML = util.promisify(require('xml2js').parseString)
const {GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLList, GraphQLString} = require('graphql')

// fetch('https://www.goodreads.com/author/show.xml?id=4432&key=risKm8wwXsIcyEiTktvA'
// )
// .then(res=> res.text())
// .then(parseXML)

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: '...',
    fields: ()=>({
        title: {
            type: GraphQLString,
            resolve: xml => xml.title[0]
        },
        isbn: {
            type: GraphQLString,
            resolve: xml=>xml.isbn[0]
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: '...',
    fields: ()=> ({
        name: {
            type: GraphQLString,
            resolve: xml => xml.GoodreadsResponse.author[0].name[0]
        },
        books: {
            type: GraphQLList(BookType),
            resolve: xml => xml.GoodreadsResponse.author[0].books[0].book[0]
        },
    })
});


module.epxorts = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        descrition: '...',

        fields: () => ({
            author: {
                type: AuthorType,
                args: {
                    id: {type: GraphQLInt}
                },
                //function GQL used to fetch data for the author
                resolve: (root, args) => 
                    fetch(`https://www.goodreads.com/author/show.xml?id=${args.id}&key=risKm8wwXsIcyEiTktvA`
                    )
                    .then(res=> res.text())
                    .then(parseXML)
            }
        })
    })
})