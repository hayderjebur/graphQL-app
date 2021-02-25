import { GraphQLServer } from 'graphql-yoga';

//Type definitions (schema)
const typeDefs = `
type Query {
    add(a:Float!,b:Float!):Float!
 post:Post
}
type Post {
    id:ID!
    title:String!
    body:String!
    published:Int!
}
`;

//Resolvers
const resolvers = {
  Query: {
    post() {
      return {
        id: '12',
        title: 'book',
        body: 'this is a good book',
        published: 1982,
      };
    },
    add(perant, args, crx, info) {
      return args.a + args.b;
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log('Server running');
});
