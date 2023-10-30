import gql from 'graphql-tag';

const bookTypeDefs = gql`
  type Book {
    id: ID
    title: String
    author: User
    createdAt: String
  }
`;
export default bookTypeDefs;
