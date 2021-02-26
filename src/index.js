import { GraphQLServer } from 'graphql-yoga';
import uuid from 'uuid/v4';
// Scalar types - String, Boolean, Int, Float, ID

// Demo user data
const users = [
  {
    id: '1',
    name: 'Andrew',
    email: 'andrew@example.com',
    age: 27,
  },
  {
    id: '2',
    name: 'Sarah',
    email: 'sarah@example.com',
  },
  {
    id: '3',
    name: 'Mike',
    email: 'mike@example.com',
  },
];

const posts = [
  {
    id: '10',
    title: 'GraphQL 101',
    body: 'This is how to use GraphQL...',
    published: true,
    author: '2',
    comment: '11',
  },
  {
    id: '11',
    title: 'GraphQL 201',
    body: 'This is an advanced GraphQL post...',
    published: false,
    author: '1',
    comment: '22',
  },
  {
    id: '12',
    title: 'Programming Music',
    body: '',
    published: false,
    author: '2',
    comment: '33',
  },
];

const comments = [
  {
    id: '11',
    content: 'hello there11',
    author: '2',
    post: '10',
  },
  {
    id: '22',
    content: 'hello there 22',
    author: '3',
    post: '12',
  },
  {
    id: '33',
    content: 'hello there33',
    author: '1',
    post: '11',
  },
  {
    id: '44',
    content: 'hello there 44 GraphQl',
    author: '3',
    post: '10',
  },
];

// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments(query:String):[Comment!]!
        me: User!
        post: Post!
    }

    type Mutation {
      createComment(content:String!,author:ID!,post:ID!):Comment!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts:[Post!]!
        comments:[Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments:[Comment!]!
    }

    type Comment {
      id:ID!
      content:String!
      author:User!
      post:Post!
    }
`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }

      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }

      return posts.filter((post) => {
        const isTitleMatch = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const isBodyMatch = post.body
          .toLowerCase()
          .includes(args.query.toLowerCase());
        return isTitleMatch || isBodyMatch;
      });
    },
    comments(parent, args, ctx, info) {
      return comments;
    },
    me() {
      return {
        id: '123098',
        name: 'Mike',
        email: 'mike@example.com',
      };
    },
    post() {
      return {
        id: '092',
        title: 'GraphQL 101',
        body: '',
        published: false,
      };
    },
  },

  Mutation: {
    createComment(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.author);
      if (!userExists) {
        throw new Error('User not exists');
      }
      const comment = {
        id: uuid(),
        ...args,
      };
      comments.push(comment);
      return comment;
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author);
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.post === parent.id);
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author);
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => post.id === parent.post);
    },
  },
  User: {
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.author === parent.id);
    },
    posts(parent, args, ctx, info) {
      return posts.filter((post) => post.author === parent.id);
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log('The server is up!');
});
