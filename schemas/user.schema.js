import gql from 'graphql-tag';

const userSchema = gql`
  input SignupInput {
    name: String!
    email: String!
    password: String!
    permissions: [String]!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateInput {
    name: String!
    email: String!
    password: String!
    permissions: [String]!
  }

  type Query {
    getAllUsers: [User]
    getUsers(total: Int): [User]
    getUserById(id: ID!): User!
  }

  type JwtToken {
    token: String!
  }

  type UserWithToken {
    _id: String
    name: String
    email: String
    password: String
    permissions: [String]
    createdAt: DateTime
    updatedAt: DateTime
    userJwtToken: JwtToken
  }

  type UserSuccess {
    isSuccess: Boolean
    message: String!
  }

  type Mutation {
    login(input: LoginInput): UserWithToken
    signup(input: SignupInput): UserWithToken
    updateUser(input: UpdateInput): UserWithToken
    deleteUser(id: String): UserSuccess
  }
`;

export default userSchema;