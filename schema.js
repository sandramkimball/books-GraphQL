//SCHEMA
//Contains types and all info on HOW to get data.
//Where the magic happens.
const {
    GraphQLSchema, 
    GraphQLObjectType, 
    GraphQLInt, 
    GraphQLList, 
    GraphQLString
    } = require('graphql')

//Object Types
const BookType = new GraphQLObjectType({
    name: 'Book',
    description: '...',

    fields: ()=>({
        title: {
            type: GraphQLString,
            args: {
                lang: {type: GraphQLString}
            },
            resolve: (xml, args) => {
            const title = xml.GoodreadsResponse.book[0].title[0]
            return ars.lang ? translate(args.lang, title) : title
            }
        },
        isbn: {
            type: GraphQLString,
            resolve: xml=>xml.GoodreadsResponse.book[0].isbn[0]
        },

        authors: {
            type: new GraphQLList(AuthorType),
            resolve: (xml, args, contect)=>{
                const authorElements= xml.GoodreadsResponse.book[0].authors[0].author
                const ids = authorElements.map(elem=> elem.id[0])
                return context.authorLoader.loadMany(ids)
        }}
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
            type: new GraphQLList(BookType),
            resolve: (xml, args, context) => {
                const ids = xml.GoodreadsResponse.author[0].books[0].book.map(elem=> elem.id[0]._)
                return context. bookLoader.loadMany(ids)
        }},
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
                resolve: (root, args, context) => context.authorLoader.load(args.id)
            }
        })
    })
})