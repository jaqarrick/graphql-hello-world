const { ApolloServer, gql } = require("apollo-server");

const books = new Map();
books.set("0", {
  title: "The Awakening",
  author: "Kate Chopin",
});

books.set("1", {
  title: "City of Glass",
  author: "Paul Auster",
});

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  input UpdateBookInput {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    book(id: ID!): Book
  }

  type Mutation {
    addBook(title: String, author: String): Book
  }

  type Mutation {
    updateBook(id: ID!, input: UpdateBookInput): Book
  }
`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => Array.from(books.values()),
    book: (_, { id }) => {
      const book = books.get(id);
      if (!book) throw "book not found";
      return book;
    },
  },
  Mutation: {
    addBook(_, payload) {
      const bookId = books.size;
      books.set(bookId, payload);
      return payload;
    },
    updateBook(_, payload) {
      const { id, input } = payload;
      const bookToUpdate = books.get(id);
      if (!bookToUpdate) throw "book not found";

      books.set(id, {
        ...bookToUpdate,
        ...input,
      });

      return books.get(id);
    },
  },
};

const {
  ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core");

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  csrfPrevention: true,
  cache: "bounded",
  /**
   * What's up with this embed: true option?
   * These are our recommended settings for using AS;
   * they aren't the defaults in AS3 for backwards-compatibility reasons but
   * will be the defaults in AS4. For production environments, use
   * ApolloServerPluginLandingPageProductionDefault instead.
   **/
  plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
