import gql from 'graphql-tag';

const userTypeDefs = gql`
  scalar DateTime

  type User {
    _id: String
    name: String
    email: String
    password: String
    createdAt: DateTime
    updatedAt: DateTime
  }
`;
export default userTypeDefs;
