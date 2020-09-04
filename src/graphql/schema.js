var { buildSchema } = require('graphql');

module.exports = buildSchema(`
    
    type Post {
        _id: ID!
        title: String!
        content: String!
        photo: String!
        createdBy: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: Boolean!
        posts: [Post!]!
    }

    type PostData {
        posts: [Post!]!
        totalPosts: Int
    }

    type AuthData {
        token: String!
        id: String!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    input PostInputData {
        title: String!
        content: String!
        photo: String!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
        createPost(post: PostInputData): Post!
    }

    type RootQuery {
        login(email: String!, password: String!): AuthData!
        posts: PostData!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }

`);
