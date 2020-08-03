import gql from 'graphql-tag';
import { DocumentNode } from 'graphql';

export const QUERY_PEOPLE_AND_MESSAGES: DocumentNode =
  gql`
  {
    messages {
      id
      description
    }
    people {
      id
      name,
      age
    }
  }
`;

export const CREATE_PERSON_MUTATION: DocumentNode = gql`
mutation createPerson($name: String!, $age: Int!) {
  createPerson(name: $name, age: $age) {
    id
    name
    age
  }
}
`;

export const CREATE_MESSAGE_MUTATION: DocumentNode = gql`
mutation createMessage($description: String!) {
  createMessage(description: $description) {
    id
    description
  }
}
`;

