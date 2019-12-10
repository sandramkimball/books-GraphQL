// const fetch = require('node-fetch')
const util = require('util')
const parseXML = util.promisify(require('xml2js').parseString)
const {GraphQLSchema, GraphQLObjectType, GraphQLInt, GraphQLList, GraphQLString} = require('graphql')

//Functions
function translate(lang, str) {
    // Google Translate API is a paid (but dirt cheap) service. This is my key
    // and will be disabled by the time the video is out. To generate your own,
    // go here: https://cloud.google.com/translate/v2/getting_started
    const apiKey =
      'AIzaSyBN-bwtos8sKU6X84wkrdjtCF7uzng6kgQ'
      const url =
      'https://www.googleapis.com' +
      '/language/translate/v2' +
        '?key=' + apiKey +
      '&source=en' +
      '&target=' + lang +
      '&q=' + encodeURIComponent(str)
    return fetch(url)
           .then(response => response.json())
        .then(parsedResponse =>
          parsedResponse
            .data
          .translations[0]
          .translatedText
      )
  }

const fetchAuthor = id => {
    fetch(`https://www.goodreads.com/author/show.xml?id=${id}&key=x7VoLKspIa5LO9bMmwxvIw`
    )
    .then(res=> res.text())
    .then(parseXML)
}

  //Object Types
const BookType = new GraphQLObjectType({
    name: 'Book',
    description: '...',
    fields: ()=>({
        title: {
            type: GraphQLString,
            resolve: (xml, args) => {
            const title = xml.GoodreadsResponse.book[0].title[0]
            return ars.lang ? translate(args.lang, title) : title
            }
        },

        isbn: {
            type: GraphQLString,
            resolve: xml=>xml.isbn[0]
        },

        authors: {
            type: new GraphQLList(AuthorType),
            resolve: xml=>{
            //returns array of strings
            const authorElements= xml.GoodreadsResponse.book[0].authors[0].author
            const ids = authorElements.map(elem=> elem.id[0])
            return Promise.all(ids.map(fetchAuthor))
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
            resolve: xml => {
                //this grabs data from parent element and extracts the ids.
                const ids = xml.GoodreadsResponse.author[0].books[0].book.map(elem=> elem.id[0]._)
                console.log('Fetching Books!')
                    return Promise.all(ids.map(id=> 
                    //then for each id extract the book info and eventually passed into each BookType
                    fetch(`https://www.goodreads.com/book/show${id}.xml?key=x7VoLKspIa5LO9bMmwxvIw`)
                    .then(res=> res.text())
                    .then(parseXML)
                ))
            }
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
                resolve: (root, args) => fetchAuthor(args.id)
            }
        })
    })
})